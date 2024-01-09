import {Pillar} from "../model/Pillar";

export abstract class AbstractSort {

    protected pillars : Pillar[];

    protected _movingFrom : number;
    protected _movingTo : number;

    constructor(pillars: Pillar[]) {
        this.pillars = pillars.slice();
    }

    movingFrom(): number {
        return this._movingFrom;
    }

    movingTo(): number {
        return this._movingTo;
    }
}