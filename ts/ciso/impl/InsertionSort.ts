import {Sort} from "../interface/Sort";
import {AbstractSort} from "./AbstractSort";

export class InsertionSort extends AbstractSort implements Sort {

    private index : number;
    private readonly isMergeSort : boolean;
    private searchStartIndex : number = 0;

    constructor(values: number[], index: number = 1) {
        super(values);
        this.index = index;
        this.isMergeSort = index > 1;
    }

    iterate(): void {
        const value = this.values[this.index];
        this._movingFrom = undefined;
        this._movingTo = undefined;
        for (let i = this.searchStartIndex; i < this.index; i++) {
            if (this.compare(value, this.values[i])) {
                this._movingFrom = this.index;
                this._movingTo = i;
                this.values = this.values.slice(0, i)
                    .concat(value)
                    .concat(this.values.slice(i, this.index))
                    .concat(this.values.slice(Math.min(this.values.length, this.index+1)));
                if (this.isMergeSort) {
                    this.searchStartIndex = i;
                }
                break;
            }
        }
        this.index++;
    }

    isSorted(): boolean {
        return this.index >= this.values.length;
    }

    getValues(): number[] {
        return this.values;
    }
}