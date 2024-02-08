import {AbstractSort} from "./AbstractSort";
import {Sort} from "../interface/Sort";

export class BubbleSort extends AbstractSort implements Sort {

    private pointer = 0;
    private max : number;

    constructor(values: number[]) {
        super(values);
        this.max = values.length;
    }

    iterate(): void {
        while (this.max > 0) {
            if (this.attemptSwap()) {
                break;
            } else {
                this.pointer = 0;
                this.max--;
            }
        }
    }

    isSorted(): boolean {
        return this.max <= 0;
    }

    getValues(): number[] {
        return this.values;
    }

    private attemptSwap() : boolean {
        for (this.pointer; this.pointer+1 < this.max; this.pointer++) {
            if (this.compare(this.values[this.pointer+1], this.values[this.pointer])) {
                this._movingFrom = this.pointer;
                this._movingTo = this.pointer+1;
                this.values = this.values.slice(0, this.pointer)
                    .concat(this.values[this.pointer+1])
                    .concat(this.values[this.pointer])
                    .concat(this.values.length > this.pointer+1 ? this.values.slice(this.pointer+2) : []);
                this.pointer++;
                return true;
            }
        }
        return false;
    }
}