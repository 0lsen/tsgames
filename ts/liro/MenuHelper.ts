import {PillarProperty} from "./enum/PillarProperty";
import {Pillar} from "./model/Pillar";
import {App} from "./App";
import {LightSourceProperty} from "./enum/LightSourceProperty";

export class MenuHelper {

    private readonly app : App;

    private readonly $lsHue = $('#lsHue');
    private readonly $lsSat = $('#lsSat');
    private readonly $lsLig = $('#lsLig');
    private readonly $lsRad = $('#lsRad');
    private readonly $lsRea = $('#lsRea');
    private readonly $lsShadAlpha = $('#lsShadAlpha');

    private readonly $piHue = $('#piHue');
    private readonly $piSat = $('#piSat');
    private readonly $piLig = $('#piLig');
    private readonly $piRad = $('#piRad');

    private readonly $piSel = $('#selectedPillar');
    private readonly $piSelHue = $('#piSelHue');
    private readonly $piSelSat = $('#piSelSat');
    private readonly $piSelLig = $('#piSelLig');
    private readonly $piSelRad = $('#piSelRad');
    private readonly $piSelRem = $('#piSelRem');

    private readonly $piAllHue = $('#piAllHue');
    private readonly $piAllSat = $('#piAllSat');
    private readonly $piAllLig = $('#piAllLig');
    private readonly $piAllRad = $('#piAllRad');
    private readonly $piAllRem = $('#piAllRem');


    constructor(app: App) {
        this.app = app;

        this.changeListenLightSource(this.$lsHue, LightSourceProperty.HUE);
        this.changeListenLightSource(this.$lsSat, LightSourceProperty.SATURATION);
        this.changeListenLightSource(this.$lsLig, LightSourceProperty.LIGHTNESS);
        this.changeListenLightSource(this.$lsRad, LightSourceProperty.RADIUS);
        this.changeListenLightSource(this.$lsRea, LightSourceProperty.REACH);
        this.changeListenLightSource(this.$lsShadAlpha, LightSourceProperty.SHADOW_ALPHA);

        this.changeListenPillar(this.$piHue, PillarProperty.HUE);
        this.changeListenPillar(this.$piSat, PillarProperty.SATURATION);
        this.changeListenPillar(this.$piLig, PillarProperty.LIGHTNESS);
        this.changeListenPillar(this.$piRad, PillarProperty.RADIUS);

        this.changeListenSelectedPillar(this.$piSelHue, PillarProperty.HUE);
        this.changeListenSelectedPillar(this.$piSelSat, PillarProperty.SATURATION);
        this.changeListenSelectedPillar(this.$piSelLig, PillarProperty.LIGHTNESS);
        this.changeListenSelectedPillar(this.$piSelRad, PillarProperty.RADIUS);
        this.$piSelRem.on('click', () => this.removeSelectedPillar());

        this.$piAllHue.on('click', () => this.setAll(PillarProperty.HUE, this.app.settings.pillarHue));
        this.$piAllSat.on('click', () => this.setAll(PillarProperty.SATURATION, this.app.settings.pillarSaturation));
        this.$piAllLig.on('click', () => this.setAll(PillarProperty.LIGHTNESS, this.app.settings.pillarLightness));
        this.$piAllRad.on('click', () => this.setAll(PillarProperty.RADIUS, this.app.settings.pillarRadius));
        this.$piAllRem.on('click', () => this.removeAllPillars());
    }

    private changeListenLightSource($input : JQuery, property : LightSourceProperty) : void {
        $input.on('change input', () => {
            let value = parseInt($input.val().toString());
            switch (property) {
                case LightSourceProperty.HUE:
                    this.app.settings.lightHue = value;
                    break;
                case LightSourceProperty.SATURATION:
                    this.app.settings.lightSaturation = value;
                    break;
                case LightSourceProperty.LIGHTNESS:
                    this.app.settings.lightBrightest = value;
                    break;
                case LightSourceProperty.RADIUS:
                    this.app.settings.lightSourceRadius = value;
                    break;
                case LightSourceProperty.REACH:
                    this.app.settings.lightSourceMaxReach = value;
                    break;
                case LightSourceProperty.SHADOW_ALPHA:
                    this.app.settings.lightSourceShadowAlpha = value;
                    break;
            }
            this.app.draw();
        });
    }

    private changeListenPillar($input : JQuery, property : PillarProperty) : void {
        $input.on('change input', () => {
            let value = parseInt($input.val().toString());
            switch (property) {
                case PillarProperty.HUE:
                    this.app.settings.pillarHue = value;
                    break;
                case PillarProperty.SATURATION:
                    this.app.settings.pillarSaturation = value;
                    break;
                case PillarProperty.LIGHTNESS:
                    this.app.settings.pillarLightness = value;
                    break;
                case PillarProperty.RADIUS:
                    this.app.settings.pillarRadius = value;
                    break;
            }
            this.app.draw();
        });
    }

    private changeListenSelectedPillar($input : JQuery, property : PillarProperty) : void {
        $input.on('change input', () => {
            let value = parseInt($input.val().toString());
            this.setPillarProperty(this.app.pillars[this.app.selectedPillar], property, value);
            this.app.draw();
        });
    }

    private setAll(property : PillarProperty, value : number) : void {
        this.app.pillars.forEach(p => this.setPillarProperty(p, property, value));
        this.app.draw();
    }

    private setPillarProperty(pillar : Pillar, property : PillarProperty, value : number) : void {
        switch (property) {
            case PillarProperty.HUE:
                pillar.hsl.hue = value;
                break;
            case PillarProperty.SATURATION:
                pillar.hsl.saturation = value;
                break;
            case PillarProperty.LIGHTNESS:
                pillar.hsl.lightness = value;
                break;
            case PillarProperty.RADIUS:
                // TODO: check collision
                pillar.radius = value;
                break;
        }
    }

    private removeSelectedPillar() : void {
        this.app.pillars.splice(this.app.selectedPillar, 1);
        this.app.draw();
    }

    private removeAllPillars() : void {
        this.app.pillars.splice(0, this.app.pillars.length);
        this.app.draw();
    }

    public setSelectedPillar(index : number|undefined = undefined) : void {
        if (index === undefined) {
            this.$piSel.hide();
        } else {
            this.$piSel.show();
            this.$piSelHue.val(this.app.pillars[index].hsl.hue);
            this.$piSelSat.val(this.app.pillars[index].hsl.saturation);
            this.$piSelLig.val(this.app.pillars[index].hsl.lightness);
            this.$piSelRad.val(this.app.pillars[index].radius);
        }
    }
}