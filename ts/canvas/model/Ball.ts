import {Coord} from "../../core/model/Coord";

export class Ball {
    private readonly _radius : number;
    private _coord : Coord;
    private _velocity : Coord = new Coord(0, 0);
    private _color : number;

    constructor(radius: number, coord: Coord, color: number) {
        this._radius = radius;
        this._coord = coord;
        this._color = color;
    }

    changeColor() : void {
        this._color = (this._color+10)%360;
    }

    get radius(): number {
        return this._radius;
    }

    get coord(): Coord {
        return this._coord;
    }

    get velocity(): Coord {
        return this._velocity;
    }

    get color(): number {
        return this._color;
    }
}