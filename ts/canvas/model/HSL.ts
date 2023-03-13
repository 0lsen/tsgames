export class HSL {
    private _hue : number;
    protected saturation : number;
    protected lightness : number;

    constructor(hue: number, saturation: number, lightness: number) {
        this._hue = hue;
        this.saturation = saturation;
        this.lightness = lightness;
    }

    get hue(): number {
        return this._hue;
    }

    set hue(value: number) {
        this._hue = value;
    }

    darken(factor : number) : HSL {
        return new HSL(this._hue, factor > 1 ? 0 : this.saturation*(1-factor)/2, factor > 1 ? 0 : this.lightness*(1-factor));
    }

    toString() : string {
        return 'hsl('+this._hue+','+this.saturation+'%,'+this.lightness+'%)';
    }
}