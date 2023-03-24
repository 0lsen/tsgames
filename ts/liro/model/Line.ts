import {Coord} from "../../core/model/Coord";

export class Line {
    private _m : number;
    private _b : number;

    constructor(point1: Coord, point2 : Coord) {
        let deltaX = point1.x - point2.x;
        let deltaY = point1.y - point2.y;
        this._m = deltaX ? deltaY/deltaX : undefined;
        this._b = deltaX ? point2.y-this._m*point2.x : point1.x;
    }

    yForX(x : number) : number {
        return this._m === undefined ? this._b : this._m * x + this._b;
    }

    get m(): number {
        return this._m;
    }

    get b(): number {
        return this._b;
    }
}