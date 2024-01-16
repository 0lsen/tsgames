import {AbstractSort} from "./AbstractSort";
import {Sort} from "../interface/Sort";

export class ScheduleSort extends AbstractSort implements Sort {

    private static _timeoutMultiplier;

    private index = 0;
    private readonly length : number

    constructor(values: number[]) {
        super(values);
        this.values = [];
        this.length = values.length;
        values.forEach((value, i) => setTimeout( ()=> {
            this.values = this.values.concat(value);
            this.index++;
            }, value * ScheduleSort._timeoutMultiplier
        ));
    }

    iterate(): void {
    }

    isSorted(): boolean {
        return this.index == this.length;
    }

    getValues(): number[] {
        return this.values.concat(Array(this.length-this.index).fill(undefined));
    }

    static set timeoutMultiplier(value) {
        this._timeoutMultiplier = value;
    }
}