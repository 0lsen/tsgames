import {Coord} from "../../core/model/Coord";

export class Building extends Coord {

    private readonly _width : number;
    private readonly _litWindows : boolean[];

    constructor(x: number, y: number, width: number, litWindows: boolean[]) {
        super(x, y);
        this._width = width;
        this._litWindows = litWindows;
    }

    get width(): number {
        return this._width;
    }

    get litWindows(): boolean[] {
        return this._litWindows;
    }
}