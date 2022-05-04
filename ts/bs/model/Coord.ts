import {Orientation} from "../../core/enum/Orientation";

export class Coord {
    private _x: number;
    private _y: number;
    private _o: Orientation;

    constructor(x: number = null, y: number = null, o: Orientation = null) {
        if (x !== null) this._x = x;
        if (y !== null) this._y = y;
        if (o !== null) this._o = o;
    }

    get x(): number {
        return this._x;
    }

    get y(): number {
        return this._y;
    }

    get o(): Orientation {
        return this._o;
    }

    set x(value: number) {
        this._x = value;
    }

    set y(value: number) {
        this._y = value;
    }

    set o(value: Orientation) {
        this._o = value;
    }
}