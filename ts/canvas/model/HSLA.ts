import {HSL} from "./HSL";

export class HSLA extends HSL {
    private alpha : number;

    constructor(hue: number, saturation: number, lightness: number, alpha: number) {
        super(hue, saturation, lightness);
        this.alpha = alpha;
    }

    toString(): string {
        return 'hsla('+this.hue+','+this._saturation+'%,'+this._lightness+'%,'+this.alpha+'%)';
    }
}