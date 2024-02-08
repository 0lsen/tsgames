import {AbstractSort} from "./AbstractSort";
import {Sort} from "../interface/Sort";
import {QuickSortElement} from "../model/QuickSortElement";

export class QuickSort extends AbstractSort implements Sort {

    private readonly baseElement : QuickSortElement;

    constructor(values: number[]) {
        super(values);
        this.baseElement = new QuickSortElement(values);
    }

    iterate(): void {
        this._comparisons += this.baseElement.iterate();
        const movingFrom = this.baseElement.movingFrom;
        const movingTo = this.baseElement.movingTo;
        if (movingFrom !== undefined && movingTo !== undefined) {
            this._movingFrom = movingFrom;
            this._movingTo = movingTo;
        }
    }

    isSorted(): boolean {
        return this.baseElement.isSorted();
    }

    getValues(): number[] {
        return this.baseElement.getValues();
    }
}