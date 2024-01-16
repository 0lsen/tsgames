export abstract class AbstractSort {

    protected values : number[];

    protected _movingFrom : number;
    protected _movingTo : number;

    constructor(values: number[]) {
        this.values = values.slice();
    }

    movingFrom(): number {
        return this._movingFrom;
    }

    movingTo(): number {
        return this._movingTo;
    }
}