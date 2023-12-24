import {Coord} from "../../core/model/Coord";

export class Chimney extends Coord {

    private readonly _height : number;
    private readonly _width: number;

    constructor(x: number, y: number, height: number, width: number) {
        super(x, y);
        this._height = height;
        this._width = width;
    }

    get height(): number {
        return this._height;
    }

    get width(): number {
        return this._width;
    }
}