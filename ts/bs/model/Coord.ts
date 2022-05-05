import {Orientation} from "../../core/enum/Orientation";
import {Coord as CoreCoord} from "../../core/model/Coord";

export class Coord extends CoreCoord {
    private _o: Orientation;

    constructor(x: number = null, y: number = null, o: Orientation = null) {
        super(x, y);
        if (o !== null) this._o = o;
    }

    get o(): Orientation {
        return this._o;
    }

    set o(value: Orientation) {
        this._o = value;
    }
}