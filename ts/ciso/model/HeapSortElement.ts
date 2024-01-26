export class HeapSortElement {

    private _atomic : number;
    private _child1 : HeapSortElement;
    private _child2 : HeapSortElement;

    constructor(atomic: number) {
        this._atomic = atomic;
    }

    get child1(): HeapSortElement {
        return this._child1;
    }

    set child1(value: HeapSortElement) {
        this._child1 = value;
    }

    get child2(): HeapSortElement {
        return this._child2;
    }

    set child2(value: HeapSortElement) {
        this._child2 = value;
    }

    get atomic(): number {
        return this._atomic;
    }

    set atomic(value: number) {
        this._atomic = value;
    }
}