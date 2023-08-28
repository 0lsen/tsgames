import {HSL} from "../../canvas/model/HSL";
import {HSLA} from "../../canvas/model/HSLA";

export class Settings {

    private _lightHue = 30;
    private _lightSaturation = 70;
    private _lightBrightest = 90;
    private _lightDarkest = 0;

    private _lightSourceRadius = 10;
    private _lightSourceMaxReach = 70;
    private _lightSourceShadowAlpha = 30;
    private _lightSourceGrabMargin = 20;

    private _pillarHue = 130;
    private _pillarSaturation = 30;
    private _pillarLightness = 60;
    private _pillarRadius = 30;

    private _lightBrightestHsl = new HSL(this._lightHue, this._lightSaturation, this._lightBrightest);
    private _lightDarkestHsl = new HSL(this._lightHue, this._lightSaturation, this._lightDarkest);
    private _lightSourceShadowHsla = new HSLA(0, 0, 0, this._lightSourceShadowAlpha);

    get lightDarkest(): number {
        return this._lightDarkest;
    }

    set lightDarkest(value: number) {
        this._lightDarkest = value;
    }

    get lightSourceGrabMargin(): number {
        return this._lightSourceGrabMargin;
    }

    set lightSourceGrabMargin(value: number) {
        this._lightSourceGrabMargin = value;
    }

    get lightBrightestHsl(): HSL {
        return this._lightBrightestHsl;
    }

    set lightBrightestHsl(value: HSL) {
        this._lightBrightestHsl = value;
    }

    get lightDarkestHsl(): HSL {
        return this._lightDarkestHsl;
    }

    set lightDarkestHsl(value: HSL) {
        this._lightDarkestHsl = value;
    }

    get lightSourceShadowHsla(): HSLA {
        return this._lightSourceShadowHsla;
    }

    set lightSourceShadowHsla(value: HSLA) {
        this._lightSourceShadowHsla = value;
    }

    get lightHue(): number {
        return this._lightHue;
    }

    set lightHue(value: number) {
        this._lightHue = value;
    }

    get lightSaturation(): number {
        return this._lightSaturation;
    }

    set lightSaturation(value: number) {
        this._lightSaturation = value;
    }

    get lightBrightest(): number {
        return this._lightBrightest;
    }

    set lightBrightest(value: number) {
        this._lightBrightest = value;
    }

    get lightSourceRadius(): number {
        return this._lightSourceRadius;
    }

    set lightSourceRadius(value: number) {
        this._lightSourceRadius = value;
    }

    get lightSourceMaxReach(): number {
        return this._lightSourceMaxReach;
    }

    set lightSourceMaxReach(value: number) {
        this._lightSourceMaxReach = value;
    }

    get lightSourceShadowAlpha(): number {
        return this._lightSourceShadowAlpha;
    }

    set lightSourceShadowAlpha(value: number) {
        this._lightSourceShadowAlpha = value;
    }

    get pillarHue(): number {
        return this._pillarHue;
    }

    set pillarHue(value: number) {
        this._pillarHue = value;
    }

    get pillarSaturation(): number {
        return this._pillarSaturation;
    }

    set pillarSaturation(value: number) {
        this._pillarSaturation = value;
    }

    get pillarLightness(): number {
        return this._pillarLightness;
    }

    set pillarLightness(value: number) {
        this._pillarLightness = value;
    }

    get pillarRadius(): number {
        return this._pillarRadius;
    }

    set pillarRadius(value: number) {
        this._pillarRadius = value;
    }
}