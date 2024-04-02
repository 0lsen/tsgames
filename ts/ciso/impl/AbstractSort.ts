import {MoveMode} from "../enum/MoveMode";

export abstract class AbstractSort {

    protected values : number[];

    protected _movingFrom : number;
    protected _movingTo : number;
    protected _moveMode : MoveMode = MoveMode.MOVE;
    protected _comparisons = 0;

    constructor(values: number[]) {
        this.values = values.slice();
    }

    protected compare(v1, v2) : boolean {
        this._comparisons++;
        return v1 < v2;
    }

    movingFrom(): number {
        return this._movingFrom;
    }

    movingTo(): number {
        return this._movingTo;
    }

    moveMode(): MoveMode {
        return this._moveMode;
    }

    comparisons(): number {
        return this._comparisons;
    }
}