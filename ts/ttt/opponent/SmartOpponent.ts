import {Opponent} from "./Opponent";
import {GameState} from "../GameState";
import {Randomizer} from "../../core/interface/Randomizer";

export class SmartOpponent implements Opponent {

    private readonly randomizer : Randomizer;

    constructor(randomizer: Randomizer) {
        this.randomizer = randomizer;
    }

    makeMove(state: GameState): void {
        let moves = this.calcMoves(state, false);
        let maxValue = Math.max(...moves);
        let maxOptionIndices = moves
            .map((m,i) => i)
            .filter((m, i) => moves[i] == maxValue);
        let chosenIndex = maxOptionIndices[this.randomizer.randomInt(maxOptionIndices.length)];
        state.play(this.getAvailableMoves(state)[chosenIndex]);
    }

    private calcMoves(state : GameState, turn : boolean) : number[] {
        let movesAvailable = this.getAvailableMoves(state);
        for (let i = 0; i < movesAvailable.length; i++) {
            movesAvailable[i] = this.evaluateMove(new GameState(state.state.slice(), turn).play(movesAvailable[i]), turn);
        }
        return movesAvailable;
    }

    private getAvailableMoves(state : GameState) : number[] {
        let movesAvailable = [];
        for (let i = 0; i < state.state.length; i++) {
            if (state.state[i] === undefined) {
                movesAvailable.push(i);
            }
        }
        return movesAvailable;
    }

    private evaluateMove(state : GameState, turn : boolean) : number {
        let won = state.hasWon();
        if (won === true) {
            return -1;
        }
        if (won === false) {
            return 1;
        }
        if (state.isFull()) {
            return 0;
        }
        let availableMoves = this.calcMoves(state, !turn);
        return turn
            ? Math.max(...availableMoves)
            : Math.min(...availableMoves);
    }
}