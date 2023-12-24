import {Coord} from "../../core/model/Coord";
import {Chimney} from "./Chimney";

export class Roof extends Coord {

    private readonly _width: number;
    private readonly _building : number;
    private readonly _chimney : Chimney;

    constructor(x: number, y: number, width: number, snowLine: number, chimney: Chimney) {
        super(x, y);
        this._width = width;
        this._building = snowLine;
        this._chimney = chimney;
    }

    get width(): number {
        return this._width;
    }

    get building(): number {
        return this._building;
    }

    get chimney(): Chimney {
        return this._chimney;
    }
}