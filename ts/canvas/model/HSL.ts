export class HSL {
    protected hue : number;
    protected saturation : number;
    protected lightness : number;

    constructor(hue: number, saturation: number, lightness: number) {
        this.hue = hue;
        this.saturation = saturation;
        this.lightness = lightness;
    }

    darken(factor : number) : HSL {
        return new HSL(this.hue, factor > 1 ? 0 : this.saturation*(1-factor)/2, factor > 1 ? 0 : this.lightness*(1-factor));
    }

    toString() : string {
        return 'hsl('+this.hue+','+this.saturation+'%,'+this.lightness+'%)';
    }
}