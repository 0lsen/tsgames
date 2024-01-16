import {Sort} from "../interface/Sort";
import {Pillar} from "../model/Pillar";
import {AbstractSort} from "./AbstractSort";

export class InsertionSort extends AbstractSort implements Sort {

    private index = 1;

    iterate(): void {
        const element = this.pillars[this.index];
        this._movingFrom = undefined;
        this._movingTo = undefined;
        for (let i = 0; i < this.index; i++) {
            if (element.height < this.pillars[i].height) {
                this._movingFrom = this.index;
                this._movingTo = i;
                this.pillars = this.pillars.slice(0, i)
                    .concat(element)
                    .concat(this.pillars.slice(i, this.index))
                    .concat(this.pillars.slice(Math.min(this.pillars.length, this.index+1)));
                break;
            }
        }
        this.index++;
    }

    isSorted(): boolean {
        return this.index >= this.pillars.length;
    }

    getState(): Pillar[] {
        return this.pillars;
    }
}