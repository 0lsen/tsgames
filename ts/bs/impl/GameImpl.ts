import {Game} from "../interface/Game";
import {State} from "../model/State";
import {ShipArrangement} from "../model/ShipArrangement";
import {Opponent} from "../interface/Opponent";
import {Setup} from "../model/Setup";
import {Board} from "../interface/Board";
import {Phase} from "../enum/Phase";
import {Turn} from "../enum/Turn";
import {Shot} from "../model/Shot";
import {BoardImpl} from "./BoardImpl";
import {WrongPhaseException} from "../exception/WrongPhaseException";
import {SetupException} from "../exception/SetupException";

export class GameImpl implements Game {

    private setup: Setup;

    private playerBoard: Board = new BoardImpl();
    private opponentBoard: Board = new BoardImpl();

    private phase: Phase = Phase.SETUP;
    private turn: Turn = Turn.PLAYER;

    private shot: Shot;

    constructor(setup: Setup) {
        this.setup = setup;
    }

    placeShips(arrangements: ShipArrangement[], opponent: Opponent): void {
        if (this.phase != Phase.SETUP) {
            throw new WrongPhaseException();
        }
        arrangements.forEach(arrangement => {
            try {
                this.setup.checkShip(arrangement.ship);
                this.playerBoard.addShip(arrangement);
                this.setup.addShip(arrangement.ship);
            } catch (e) {
                this.reset();
                throw e;
            }
        });
        if (this.setup.isComplete()) {
            opponent.placeShipsOn(this.opponentBoard, this.setup);
            this.phase = Phase.FIRING;
        } else {
            this.reset();
            throw new SetupException();
        }
    }

    shoot(x: number, y: number, opponent: Opponent): void {
        if (this.phase != Phase.FIRING) {
            throw new WrongPhaseException();
        }
        this.shot = new Shot();
        this.shot.shooter = this.turn;
        if (this.turn == Turn.PLAYER) {
            this.shot.x = x;
            this.shot.y = y;
            this.shot.hit = this.opponentBoard.shoot(x, y);
            if (!this.shot.hit) {
                this.turn = Turn.OPPONENT;
            }
        } else {
            opponent.shootAt(this.playerBoard, this.shot, this.setup);
            if (!this.shot.hit) {
                this.turn = Turn.PLAYER;
            }
        }

        if (this.opponentBoard.isBeaten() || this.playerBoard.isBeaten()) {
            this.phase = Phase.FINISHED;
        }
    }

    isFinished(): boolean {
        return this.phase === Phase.FINISHED;
    }

    reset(): void {
        this.playerBoard = new BoardImpl();
        this.opponentBoard = new BoardImpl();
        this.phase = Phase.SETUP;
        this.turn = Turn.PLAYER;
        this.setup = this.setup.copy();
    }

    getState(): State {
        let state = new State();
        state.phase = this.phase;
        state.turn = this.turn;
        state.setup = this.setup;
        state.playerBoard = this.playerBoard;
        state.opponentBoard = new BoardImpl(this.opponentBoard);
        state.lastShot = this.shot;
        state.playerBeaten = this.playerBoard.isBeaten();
        state.opponentBeaten = this.opponentBoard.isBeaten();
        return state;
    }
}