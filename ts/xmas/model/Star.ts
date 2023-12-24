import {CanvasBall} from "../../canvas/model/CanvasBall";
import {HSL} from "../../canvas/model/HSL";

export class Star extends CanvasBall {

    private readonly _color : HSL;

    constructor(x: number, y: number, radius: number, color : HSL) {
        super(x, y, radius);
        this._color = color;
    }

    get color(): HSL {
        return this._color;
    }
}