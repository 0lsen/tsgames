export abstract class AbstractSort {

    protected values : number[];

    protected _movingFrom : number;
    protected _movingTo : number;
    protected _makeSwap : boolean = false;

    constructor(values: number[]) {
        this.values = values.slice();
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
}