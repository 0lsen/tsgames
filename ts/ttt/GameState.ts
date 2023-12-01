import {OutOfBoundsException} from "../core/exception/OutOfBoundsException";
import {booleanUndefined} from "../core/types";

export class GameState {

    private readonly winLines = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8],
        [0, 3, 6], [1, 4, 7], [2, 5, 8],
        [0, 4, 8], [2, 4, 6]
    ];

    private _state : booleanUndefined[] = Array(9).fill(undefined);

    private turn : boolean = true;

    constructor(state: booleanUndefined[] = undefined, turn: boolean = undefined) {
        if (state) {
            this._state = state;
        }
        if(turn !== undefined) {
            this.turn = turn;
        }
    }

    public play(position : number) : this {
        position = Math.floor(position);
        if (position < 0 || position > 8 || this._state[position] !== undefined) {
            throw new OutOfBoundsException();
        }
        this._state[position] = this.turn;
        this.turn = !this.turn;
        return this;
    }

    public isFull() : boolean {
        return this._state.filter(s => s === undefined).length === 0;
    }

    public hasWon() : boolean {
        if (this.hasPlayerWon(true)) {
            return true;
        }
        if (this.hasPlayerWon(false)) {
            return false;
        }
        return undefined;
    }

    public getWinLine() : number[] {
        return this.winLines.find(line => line.every(pos => this._state[pos] === this.hasWon()));
    }

    private hasPlayerWon(player : boolean) : boolean {
        return this.winLines.find(line => line.every(pos => this._state[pos] === player)) !== undefined;
    }

    get state(): booleanUndefined[] {
        return this._state;
    }
}