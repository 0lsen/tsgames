import {Opponent} from "./Opponent";
import {Randomizer} from "../../core/interface/Randomizer";
import {GameState} from "../GameState";

export class DumbOpponent implements Opponent {

    private readonly randomizer : Randomizer;

    constructor(randomizer: Randomizer) {
        this.randomizer = randomizer;
    }

    makeMove(state: GameState): void {
        if (this.tryWinningMove(state)) {
            return;
        }
        if (this.tryToAvoidLosingMove(state)) {
            return;
        }
        this.makeRandomMove(state);
    }

    private tryWinningMove(state: GameState) : boolean {
        let immanentWins = this.findWinningMoves(state.state);
        if (immanentWins.length) {
            state.play(immanentWins[this.randomizer.randomInt(immanentWins.length)]);
            return true;
        } else {
            return false;
        }
    }

    private findWinningMoves(state: boolean[]) : number[] {
        let moves = [];
        let newState : GameState;
        for (let i = 0; i < 9; i++) {
            if (state[i] === undefined) {
                newState = new GameState(state.slice(), false);
                newState.play(i);
                if (newState.hasWon() === false) {
                    moves.push(i);
                }
            }
        }
        return moves;
    }

    private tryToAvoidLosingMove(state: GameState) : boolean {
        let immanentDangers = this.findDangerousMoves(state.state);
        if (immanentDangers.length) {
            state.play(immanentDangers[this.randomizer.randomInt(immanentDangers.length)]);
            return true;
        } else {
            return false;
        }
    }

    private findDangerousMoves(state: boolean[]) : number[] {
        let moves = [];
        let newState : GameState;
        if (state.filter(s => s === undefined).length > 1) {
            for (let i = 0; i < 9; i++) {
                if (state[i] === undefined) {
                    for (let j = 0; j < 9; j++) {
                        if (i !== j && state[j] === undefined) {
                            newState = new GameState(state.slice(), false);
                            newState.play(j);
                            newState.play(i);
                            if (newState.hasWon() === true) {
                                moves.push(i);
                            }
                            break;
                        }
                    }
                }
            }
        }
        return moves;
    }

    private makeRandomMove(state: GameState) : void {
        let success = false;
        do {
            try {
                state.play(this.randomizer.randomInt(9));
                success = true;
            } catch (e) {}
        } while (!success);
    }
}