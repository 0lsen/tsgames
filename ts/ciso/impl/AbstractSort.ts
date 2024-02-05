export abstract class AbstractSort {

    protected values : number[];

    protected _movingFrom : number;
    protected _movingTo : number;
    protected _makeSwap : boolean = false;
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

    makeSwap(): boolean {
        return this._makeSwap;
    }

    comparisons(): number {
        return this._comparisons;
    }
}