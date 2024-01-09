import {Sort} from "../interface/Sort";
import {Pillar} from "../model/Pillar";
import {AbstractSort} from "./AbstractSort";

export class SelectionSort extends AbstractSort implements Sort {

    private readonly sorted : Pillar[] = [];

    iterate(): void {
        let min = 0;
        for (let i = 1; i < this.pillars.length; i++) {
            if (this.pillars[i].height < this.pillars[min].height) {
                min = i;
            }
        }
        this._movingFrom = min+this.sorted.length;
        this._movingTo = this.sorted.length;
        this.sorted.push(this.pillars[min]);
        this.pillars.splice(min, 1);
    }

    isSorted(): boolean {
        return this.pillars.length < 2;
    }

    getState(): Pillar[] {
        return this.sorted.concat(this.pillars);
    }
}