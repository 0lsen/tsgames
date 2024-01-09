import {AbstractSort} from "./AbstractSort";
import {Sort} from "../interface/Sort";
import {Pillar} from "../model/Pillar";

export class ScheduleSort extends AbstractSort implements Sort {

    private static _timeoutMultiplier;

    private index = 0;

    constructor(pillars: Pillar[]) {
        super(pillars);
        this.pillars.forEach((pillar, i) => setTimeout( ()=> {
            this.pillars.splice(this.pillars.indexOf(pillar), 1);
            this.pillars = this.pillars
                .slice(0, this.index)
                .concat(pillar).concat(this.pillars.slice(this.index));
            this.index++;
            }, pillar.height * ScheduleSort._timeoutMultiplier
        ));
    }

    iterate(): void {
    }

    isSorted(): boolean {
        return this.index == this.pillars.length;
    }

    getState(): Pillar[] {
        return this.pillars.slice(0, this.index).concat(Array(this.pillars.length-this.index).fill(new Pillar(undefined)));
    }

    static set timeoutMultiplier(value) {
        this._timeoutMultiplier = value;
    }
}