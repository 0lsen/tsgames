import {Sort} from "../interface/Sort";
import {AbstractSort} from "./AbstractSort";

export class SelectionSort extends AbstractSort implements Sort {

    private readonly sorted : number[] = [];

    iterate(): void {
        let min = 0;
        for (let i = 1; i < this.values.length; i++) {
            if (this.compare(this.values[i], this.values[min])) {
                min = i;
            }
        }
        this._movingFrom = min+this.sorted.length;
        this._movingTo = this.sorted.length;
        this.sorted.push(this.values[min]);
        this.values.splice(min, 1);
    }

    isSorted(): boolean {
        return this.values.length < 2;
    }

    getValues(): number[] {
        return this.sorted.concat(this.values);
    }
}