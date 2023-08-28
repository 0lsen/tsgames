import {CanvasBall} from "../../canvas/model/CanvasBall";
import {PillarShadow} from "./PillarShadow";
import {HSL} from "../../canvas/model/HSL";

export class Pillar extends CanvasBall {
    private _shadow : PillarShadow;
    private _hsl : HSL;

    constructor(x: number = undefined, y: number = undefined, radius: number = undefined, hsl: HSL = new HSL) {
        super(x, y, radius);
        this._hsl = hsl;
    }

    get shadow(): PillarShadow {
        return this._shadow;
    }

    set shadow(value: PillarShadow) {
        this._shadow = value;
    }

    get hsl(): HSL {
        return this._hsl;
    }

    set hsl(value: HSL) {
        this._hsl = value;
    }
}