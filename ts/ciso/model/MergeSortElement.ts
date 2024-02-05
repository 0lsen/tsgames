import {Sort} from "../interface/Sort";
import {InsertionSort} from "../impl/InsertionSort";

export class MergeSortElement {

    private sort : Sort;
    private _child1 : MergeSortElement;
    private _child2 : MergeSortElement;
    private _atomic : number;

    set child1(value: MergeSortElement) {
        this._child1 = value;
    }

    set child2(value: MergeSortElement) {
        this._child2 = value;
    }

    get atomic(): number {
        return this._atomic;
    }

    set atomic(value: number) {
        this._atomic = value;
    }

    public iterate() : number {
        if (!this._child1.isSorted()) {
            return this._child1.iterate();
        } else if (!this._child2.isSorted()) {
            return this._child2.iterate();
        } else if (this.sort === undefined) {
            this.sort = new InsertionSort(this._child1.getValues().concat(this._child2.getValues()), this._child1.getValues().length);
            this.sort.iterate();
            return this.sort.comparisons();
        } else {
            const comparionsBefore = this.sort.comparisons();
            this.sort.iterate();
            return this.sort.comparisons()-comparionsBefore;
        }
    }

    public isSorted() : boolean {
        return this._atomic !== undefined || (this.sort !== undefined && this.sort.isSorted());
    }

    public getValues() : number[] {
        return this._atomic !== undefined
            ? [this._atomic]
            : this.sort === undefined ? this._child1.getValues().concat(this._child2.getValues()) : this.sort.getValues();
    }

    public movingFrom() : number {
        return this.sort.movingFrom();
    }

    public movingTo() : number {
        return this.sort.movingTo();
    }
}