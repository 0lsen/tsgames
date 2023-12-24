import {CanvasBall} from "../../canvas/model/CanvasBall";
import {HSLA} from "../../canvas/model/HSLA";
import {Coord} from "../../core/model/Coord";

export class Cloud extends Coord {

    private readonly _color : HSLA;
    private readonly _segments : CanvasBall[];

    constructor(x: number, y: number, color : HSLA, segments : CanvasBall[]) {
        super(x, y);
        this._color = color;
        this._segments = segments;
    }

    get color(): HSLA {
        return this._color;
    }

    get segments(): CanvasBall[] {
        return this._segments;
    }
}