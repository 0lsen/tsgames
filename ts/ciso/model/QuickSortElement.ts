export class QuickSortElement {

    private values : number[];
    private readonly pivotValue : number;
    private readonly pivotIndex : number;
    private pointer = 0;
    private pivotPosition = 0;
    private finished = false;
    private leftElement : QuickSortElement;
    private rightElement : QuickSortElement;

    private _movingFrom : number;
    private _movingTo : number;

    constructor(values: number[]) {
        this.values = values;
        this.pivotIndex = values.length-1;
        this.pivotValue = values[this.pivotIndex];
        if (this.pivotIndex < 0) {
            this.finished = true;
        }
    }

    public iterate() : number {
        this._movingFrom = undefined;
        this._movingTo = undefined;
        let comparisons = 0;
        if (!this.finished) {
            for (this.pointer; this.pointer < this.pivotIndex; this.pointer++) {
                comparisons++;
                if (this.values[this.pointer] < this.pivotValue) {
                    if (this.pivotPosition < this.pointer) {
                        this._movingFrom = this.pointer;
                        this._movingTo = this.pivotPosition;
                        this.moveValue();
                        this.pointer++;
                        this.pivotPosition++;
                        return comparisons;
                    } else {
                        this.pivotPosition++;
                    }
                }
            }

            this.finished = true;
            if (this.pivotPosition != this.pivotIndex) {
                this._movingFrom = this.pivotIndex;
                this._movingTo = this.pivotPosition;
                this.moveValue();
            }
            const left = this.values.slice(0, this.pivotPosition);
            const right = this.values.slice(this.pivotPosition+1);
            if (left.length > 1) {
                this.leftElement = new QuickSortElement(left);
            }
            if (right.length > 1) {
                this.rightElement = new QuickSortElement(right);
            }
            if (this.pivotPosition != this.pivotIndex) {
                return comparisons;
            }
        }
        if (this.leftElement !== undefined) {
            comparisons += this.leftElement.iterate();
            if (this.leftElement.movingFrom !== undefined) {
                this._movingFrom = this.leftElement.movingFrom;
                this._movingTo = this.leftElement.movingTo;
                return comparisons;
            }
        }
        if (this.rightElement !== undefined) {
            comparisons += this.rightElement.iterate();
            if (this.rightElement.movingFrom !== undefined) {
                this._movingFrom = this.pivotPosition + 1 + this.rightElement.movingFrom;
                this._movingTo = this.pivotPosition + 1 + this.rightElement.movingTo;
                return comparisons;
            }
        }
        return comparisons;
    }

    public isSorted() : boolean {
        return this.finished &&
            (this.leftElement === undefined || this.leftElement.isSorted()) &&
            (this.rightElement === undefined || this.rightElement.isSorted());
    }

    public getValues() : number[] {
        return this.leftElement !== undefined
            ? this.leftElement.getValues().concat(this.pivotValue).concat(
                this.rightElement !== undefined
                    ? this.rightElement.getValues()
                    : this.values.slice(this.pivotPosition+1)
            )
            : this.rightElement !== undefined
                ? this.values.slice(0, this.pivotPosition+1).concat(this.rightElement.getValues())
                : this.values;
    }

    private moveValue() : void {
        this.values = this.values.slice(0, this._movingTo)
            .concat(this.values[this._movingFrom])
            .concat(this.values.slice(this._movingTo, this._movingFrom))
            .concat(this.values.slice(Math.min(this.values.length, this._movingFrom+1)));
    }

    get movingFrom(): number {
        return this._movingFrom;
    }

    get movingTo(): number {
        return this._movingTo;
    }
}