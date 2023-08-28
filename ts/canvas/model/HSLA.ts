import {HSL} from "./HSL";

export class HSLA extends HSL {
    private _alpha : number;

    constructor(hue: number = undefined, saturation: number = undefined, lightness: number = undefined, alpha: number = undefined) {
        super(hue, saturation, lightness);
        this._alpha = alpha;
    }

    toString(): string {
        return 'hsla('+this.hue+','+this._saturation+'%,'+this._lightness+'%,'+this._alpha+'%)';
    }

    set alpha(value: number) {
        this._alpha = value;
    }
}