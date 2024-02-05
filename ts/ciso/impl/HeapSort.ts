import {AbstractSort} from "./AbstractSort";
import {Sort} from "../interface/Sort";
import {HeapSortElement} from "../model/HeapSortElement";
import {ThisShouldNeverHappenException} from "../../core/exception/ThisShouldNeverHappenException";

export class HeapSort extends AbstractSort implements Sort {

    private readonly maxHeap : number[] = []
    private readonly initialElement : HeapSortElement;

    private chooseNextInitialAtomic = false;

    constructor(values: number[]) {
        super(values);

        if (!values.length) {
            return;
        }

        this.initialElement = new HeapSortElement(values[0]);
        let currentLevel = [this.initialElement];
        let newLevel : HeapSortElement[] = [];
        let currentElement = 0;

        for (let i = 1; i < values.length; i++) {
            const newElement = new HeapSortElement(values[i]);
            newLevel.push(newElement);
            if (currentLevel[currentElement].child1 === undefined) {
                currentLevel[currentElement].child1 = newElement;
            } else {
                currentLevel[currentElement++].child2 = newElement;
            }
            if (currentElement == currentLevel.length) {
                currentLevel = newLevel;
                newLevel = [];
                currentElement = 0;
            }
        }
    }

    iterate(): void {
        this._makeSwap = false;
        if (this.chooseNextInitialAtomic) {
            const lastElement = this.lastElement();
            if (lastElement.child2 !== undefined) {
                this._movingFrom = this.getElementIndex(lastElement.child2);
                this.initialElement.atomic = lastElement.child2.atomic;
                lastElement.child2 = undefined;
            } else if (lastElement.child1 !== undefined) {
                this._movingFrom = this.getElementIndex(lastElement.child1);
                this.initialElement.atomic = lastElement.child1.atomic;
                lastElement.child1 = undefined;
            } else {
                this._movingFrom = this.getElementIndex(lastElement);
                this.initialElement.atomic = lastElement.atomic;
                lastElement.atomic = undefined;
            }
            this._movingTo = 0;
            this.chooseNextInitialAtomic = false;
        } else  {
            const heapifyActionHappened = this.attemptHeapify();
            if (heapifyActionHappened) {
                this._makeSwap = this._movingFrom-this._movingTo > 1;
            } else {
                const max = this.initialElement.atomic;
                this.maxHeap.push(max);
                this._movingFrom = 0;
                this._movingTo = this.values.length - this.maxHeap.length;
                this.chooseNextInitialAtomic = true;
            }
        }
    }

    isSorted(): boolean {
        return this.maxHeap.length >= this.values.length-1;
    }

    getValues(): number[] {
        let currentLevel = [this.initialElement];
        const unsortedValues : number[] = [];
        let newLevel : HeapSortElement[] = [];
        do {
            currentLevel.forEach(element => {
                if (element !== undefined && element.atomic !== undefined) {
                    if (!(this.chooseNextInitialAtomic && element === this.initialElement)) {
                        unsortedValues.push(element.atomic);
                    }
                    newLevel.push(element.child1, element.child2);
                }
            });
            currentLevel = newLevel;
            newLevel = [];
        } while (currentLevel.find(e => e !== undefined && e.atomic !== undefined) !== undefined);
        let values = unsortedValues.concat(this.maxHeap.reverse());
        this.maxHeap.reverse();
        return values;
    }

    private createLevels() : HeapSortElement[][] {
        const levels : HeapSortElement[][] = [];
        let currentLevel = [this.initialElement];
        let newLevel : HeapSortElement[] = [];
        while (currentLevel.find(e => e.child1 !== undefined || e.child2 !== undefined) !== undefined) {
            currentLevel.forEach(element => {
                if (element.child1 !== undefined) {
                    newLevel.push(element.child1);
                }
                if (element.child2 !== undefined) {
                    newLevel.push(element.child2);
                }
            });
            levels.push(currentLevel);
            currentLevel = newLevel;
            newLevel = [];
        }
        return levels;
    }

    private lastElement() : HeapSortElement {
        let lastLevel = this.createLevels().reverse()[0].reverse();
        let lastElementWithChildren = lastLevel.find(e => e.child1 !== undefined || e.child2 !== undefined);
        return lastElementWithChildren ?? lastLevel[0];
    }

    private attemptHeapify() : boolean {
        const levels = this.createLevels();
        for (let i = levels.length-1; i >= 0; i--) {
            for (let j = levels[i].length-1; j >= 0; j--) {
                const element = levels[i][j];
                if (!element.touched) {
                    continue;
                }
                let max = element.atomic;
                let swapChild1 = false;
                let swapChild2 = false;
                if (element.child1 !== undefined && this.compare(max, element.child1.atomic)) {
                    max = element.child1.atomic;
                    swapChild1 = true;
                }
                if (element.child2 !== undefined && this.compare(max, element.child2.atomic)) {
                    swapChild2 = true;
                }

                this._movingTo = this.getElementIndex(element);
                if (swapChild2) {
                    const value = element.child2.atomic;
                    element.child2.atomic = element.atomic;
                    element.atomic = value;
                    this._movingFrom = this.getElementIndex(element.child2);
                    return true;
                } else if (swapChild1) {
                    const value = element.child1.atomic;
                    element.child1.atomic = element.atomic;
                    element.atomic = value;
                    this._movingFrom = this.getElementIndex(element.child1);
                    return true;
                }
                element.untouch();
            }
        }
        this._movingFrom = undefined;
        this._movingTo = undefined;
        return false;
    }

    private getElementIndex(search : HeapSortElement) : number {
        let currentLevel = [this.initialElement];
        let newLevel : HeapSortElement[] = [];
        let index = 0;
        do {
            for (let i = 0; i < currentLevel.length; i++) {
                const element = currentLevel[i];
                if (element === search) {
                    return index;
                }
                if (element !== undefined && element.atomic !== undefined) {
                    if (!(this.chooseNextInitialAtomic && element === this.initialElement)) {
                        index++
                    }
                    newLevel.push(element.child1, element.child2);
                }
            }
            currentLevel = newLevel;
            newLevel = [];
        } while (currentLevel.find(e => e !== undefined && e.atomic !== undefined) !== undefined);
        throw new ThisShouldNeverHappenException();
    }
}