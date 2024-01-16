import {AbstractSort} from "./AbstractSort";
import {Sort} from "../interface/Sort";
import {MergeSortElement} from "../model/MergeSortElement";
import {ThisShouldNeverHappenException} from "../../core/exception/ThisShouldNeverHappenException";

export class MergeSort extends AbstractSort implements Sort {

    private readonly elements : MergeSortElement[] = [];
    private pointer : number;

    constructor(values: number[]) {
        super(values);

        if (!values.length) {
            return;
        }

        const valueMapping : number[][] = [];
        const initialElement = new MergeSortElement();
        if (values.length == 1) {
            initialElement.atomic = values[0];
        }
        this.elements.push(initialElement);
        valueMapping.push(values);
        let currentLevel  = [initialElement];

        while (currentLevel.filter(c => c.atomic !== undefined).length != currentLevel.length) {
            const newLevel : MergeSortElement[] = [];
            for (let currentChild of currentLevel) {
                if (currentChild.atomic === undefined) {
                    const childValues = valueMapping[this.elements.indexOf(currentChild)];
                    const frontHalf = childValues.slice(0, Math.floor(childValues.length/2));
                    const backHalf = childValues.slice(Math.floor(childValues.length/2));
                    const frontElement = new MergeSortElement();
                    const backElement = new MergeSortElement();
                    if (frontHalf.length == 1) {
                        frontElement.atomic = frontHalf[0];
                    }
                    if (backHalf.length == 1) {
                        backElement.atomic = backHalf[0];
                    }
                    newLevel.push(backElement);
                    this.elements.push(backElement);
                    valueMapping.push(backHalf);
                    currentChild.child2 = backElement;
                    newLevel.push(frontElement);
                    this.elements.push(frontElement);
                    valueMapping.push(frontHalf);
                    currentChild.child1 = frontElement;
                }
            }
            currentLevel = newLevel;
        }
        this.pointer = this.elements.length-1;
    }

    iterate(): void {
        while (this.elements[this.pointer].isSorted()) {
            this.pointer--;
            if (this.pointer < 0) {
                throw new ThisShouldNeverHappenException('merge sort iteration without checking if already sorted');
            }
        }
        this.elements[this.pointer].iterate();
        const movingFrom = this.elements[this.pointer].movingFrom();
        const movingTo = this.elements[this.pointer].movingTo();
        if (movingFrom !== undefined && movingTo !== undefined) {
            const valueFrom = this.elements[this.pointer].getValues()[movingFrom];
            const valueTo = this.elements[this.pointer].getValues()[movingTo];
            this._movingFrom = this.getValues().indexOf(valueFrom);
            this._movingTo = this.getValues().indexOf(valueTo);
        } else {
            this._movingFrom = undefined;
            this._movingTo = undefined;
        }
    }

    isSorted(): boolean {
        return this.elements.length ? this.elements[0].isSorted() : true;
    }

    getValues(): number[] {
        return this.elements.length ? this.elements[0].getValues() : [];
    }
}