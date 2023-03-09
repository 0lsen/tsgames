import {CanvasBall} from "../../canvas/model/CanvasBall";
import {PillarShadow} from "./PillarShadow";

export class Pillar extends CanvasBall {
    private _shadow : PillarShadow;

    get shadow(): PillarShadow {
        return this._shadow;
    }

    set shadow(value: PillarShadow) {
        this._shadow = value;
    }
}