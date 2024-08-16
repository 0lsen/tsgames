import {Sort} from "../interface/Sort";
import {AbstractSort} from "./AbstractSort";

export class RadixSort extends AbstractSort implements Sort {

    private buckets : number[][];
    private readonly maxLength : number;
    private layer = 0;

    constructor(values: number[]) {
        values = values.map(Math.floor);
        super(values);
        this.buckets = [];
        this.maxLength = values.length ? values.reduce((max, value) => Math.max(max, value) , 0).toString().length : 0;
    }

    iterate(): void {
        while(!this.isSorted() && !this.it()){}
    }

    private it() : boolean {
        let movementHappened = true;
        if (!this.buckets.length) {
            movementHappened = false;
        }
        const value = this.values[0];
        this.values = this.values.slice(1);
        let bucketIndex : number;
        if (value.toString().length < this.layer+1) {
            bucketIndex = 0;
            this.addToBucket(0, value);
            if (this.buckets.length === 1) {
                movementHappened = false;
            }
        } else {
            bucketIndex = parseInt(value.toString().split('').reverse()[this.layer]);
            this.addToBucket(bucketIndex, value);
            if (this.buckets.length === bucketIndex+1) {
                movementHappened = false;
            }
        }
        this._movingFrom = movementHappened ? this.valuesFromBuckets().length-1 : undefined;
        this._movingTo = movementHappened ? this.buckets.slice(0, bucketIndex+1).map(bucket => bucket.length).reduce((a, b) => a+b, 0)-1 : undefined;
        if (!this.values.length) {
            this.values = this.valuesFromBuckets();
            this.buckets = [];
            this.layer++;
        }
        return movementHappened;
    }

    isSorted(): boolean {
        return this.layer === this.maxLength;
    }

    getValues(): number[] {
        return this.valuesFromBuckets().concat(this.values);
    }

    private valuesFromBuckets() : number[] {
        return this.buckets.reduce((values, bucket) => values.concat(bucket), []);
    }

    private addToBucket(index : number, value : number) : void {
        if (this.buckets[index] === undefined) {
            this.buckets[index] = [];
        }
        this.buckets[index].push(value);
    }
}