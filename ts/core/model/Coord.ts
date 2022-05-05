export class Coord {
    private _x: number;
    private _y: number;

    constructor(x: number, y: number) {
        if (x !== null) this._x = x;
        if (y !== null) this._y = y;
    }

    equals(other : Coord) : boolean {
        return other.x === this.x && other.y === this.y;
    }

    get x(): number {
        return this._x;
    }

    set x(value: number) {
        this._x = value;
    }

    get y(): number {
        return this._y;
    }

    set y(value: number) {
        this._y = value;
    }
}