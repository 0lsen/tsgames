import {Coord} from "../../core/model/Coord";

export class CanvasBall extends Coord {
    private _radius : number;

    constructor(x: number, y: number, radius: number) {
        super(x, y);
        this._radius = radius;
    }

    get radius(): number {
        return this._radius;
    }

    set radius(value: number) {
        this._radius = value;
    }
}