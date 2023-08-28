export class HSL {
    private _hue : number;
    protected _saturation : number;
    protected _lightness : number;

    constructor(hue: number = undefined, saturation: number = undefined, lightness: number = undefined) {
        this._hue = hue;
        this._saturation = saturation;
        this._lightness = lightness;
    }

    get hue(): number {
        return this._hue;
    }

    set hue(value: number) {
        this._hue = value;
    }

    set saturation(value: number) {
        this._saturation = value;
    }

    get lightness(): number {
        return this._lightness;
    }

    set lightness(value: number) {
        this._lightness = value;
    }

    darken(factor : number, lightSourceLightness : number) : HSL {
        return new HSL(
            this._hue,
            factor > 1 ? 0 : this._saturation*(1-factor)/2,
            factor > 1 ? 0 : this._lightness*(1-factor)*(1-factor)*(lightSourceLightness/100)
        );
    }

    toString() : string {
        return 'hsl('+this._hue+','+this._saturation+'%,'+this._lightness+'%)';
    }
}