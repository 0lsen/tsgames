export class HeapSortElement {

    private _atomic : number;
    private _child1 : HeapSortElement;
    private _child2 : HeapSortElement;
    private _touched : boolean = true;

    constructor(atomic: number) {
        this._atomic = atomic;
    }

    get child1(): HeapSortElement {
        return this._child1;
    }

    set child1(value: HeapSortElement) {
        this._child1 = value;
        this._touched = true;
    }

    get child2(): HeapSortElement {
        return this._child2;
    }

    set child2(value: HeapSortElement) {
        this._child2 = value;
        this._touched = true;
    }

    get atomic(): number {
        return this._atomic;
    }

    set atomic(value: number) {
        this._atomic = value;
        this._touched = true;
    }

    get touched(): boolean {
        return this._touched;
    }

    untouch() : void {
        this._touched = false;
    }
}