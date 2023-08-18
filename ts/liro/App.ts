import {Coord} from "../core/model/Coord";
import {CanvasApp} from "../canvas/CanvasApp";
import {CanvasBall} from "../canvas/model/CanvasBall";
import {CanvasTools} from "../canvas/CanvasTools";
import {HSL} from "../canvas/model/HSL";
import {Pillar} from "./model/Pillar";
import {DrawHelper} from "./DrawHelper";
import {MenuHelper} from "./MenuHelper";
import {Settings} from "./model/Settings";
import {FlickerSectionCalculatorImpl} from "./impl/FlickerSectionCalculatorImpl";

export class App extends CanvasApp {

    protected readonly _dimensions = new Coord(700, 700);

    private readonly _settings = new Settings();
    private readonly drawHelper : DrawHelper;
    private readonly menuHelper : MenuHelper;

    private readonly _lightSource : CanvasBall;
    private grabbingLightSource : boolean = false;

    private readonly _pillars : Pillar[] = [];
    private grabbingPillar : number = undefined;

    private _selectedPillar : number = undefined;

    constructor() {
        super();
        this._lightSource = new CanvasBall(this.dimensions.x/2, this.dimensions.y/2, this.settings.lightSourceRadius);
        this.drawHelper = new DrawHelper(this, new FlickerSectionCalculatorImpl(this.randomizer));
        this.menuHelper = new MenuHelper(this);

        this.canvas.addEventListener('mousedown', (e) => this.mouseDown(e));
        this.canvas.addEventListener('mousemove', (e) => this.mouseMove(e));
        this.canvas.addEventListener('mouseup', (e) => this.mouseUp(e));
    }

    protected init() {
        super.init();
        this.draw();
    }

    private setSelectedPillar(index : number|undefined = undefined) : void {
        this._selectedPillar = index;
        this.menuHelper.setSelectedPillar(index);
    }

    private mouseDown(e : MouseEvent) : void {
        let mouseCoord = this.getMouseCoord(e);
        if (CanvasTools.isBallGrab(mouseCoord, this._lightSource, this.settings.lightSourceGrabMargin)) {
            this.grabbingLightSource = true;
            this.grabbingPillar = undefined;
            this.setSelectedPillar();
        } else {
            this.grabbingLightSource = false;
            let pillar = this._pillars.find(p => CanvasTools.isBallGrab(mouseCoord, p));
            if (pillar !== undefined) {
                this.grabbingPillar = this._pillars.indexOf(pillar);
                this.setSelectedPillar(this.grabbingPillar);
            } else {
                this.grabbingPillar = undefined;
                if (this.noNewPillarCollision(mouseCoord)) {
                    this.createPillar(mouseCoord);
                    this.setSelectedPillar(this._pillars.length-1);
                } else {
                    this.setSelectedPillar();
                }
            }
        }
    }

    private mouseMove(e : MouseEvent) : void {
        let mouseCoord = this.getMouseCoord(e);
        if (this.grabbingLightSource && this.noCollision(mouseCoord, undefined)) {
            this._lightSource.x = mouseCoord.x;
            this._lightSource.y = mouseCoord.y;
        } else if (this.grabbingPillar !== undefined && this.noCollision(mouseCoord, this.grabbingPillar)) {
            this._pillars[this.grabbingPillar].x = mouseCoord.x;
            this._pillars[this.grabbingPillar].y = mouseCoord.y;
        }
    }

    private mouseUp(e : MouseEvent) : void {
        this.grabbingLightSource = false;
        this.grabbingPillar = undefined;
    }

    private noNewPillarCollision(mouseCoord : Coord) : boolean {
        let newPillar = new CanvasBall(mouseCoord.x, mouseCoord.y, this.settings.pillarRadius);
        return !CanvasTools.isBallCollision(newPillar, this._lightSource) &&
            this._pillars.every(p => !CanvasTools.isBallCollision(newPillar, p));
    }

    private noCollision(mouseCoord : Coord, pillarIndex : number) : boolean {
        let ball = new CanvasBall(
            mouseCoord.x,
            mouseCoord.y,
            pillarIndex === undefined ? this.settings.lightSourceRadius : this._pillars[pillarIndex].radius
        );
        for (let i = 0; i < this._pillars.length; i++) {
            if (i === pillarIndex) continue;
            if (CanvasTools.isBallCollision(ball, this._pillars[i])) {
                return false;
            }
        }
        // TODO: check distance to canvas borders
        return pillarIndex === undefined || !CanvasTools.isBallCollision(ball, this._lightSource);
    }

    private createPillar(coord : Coord) : void {
        this._pillars.push(new Pillar(coord.x, coord.y, this.settings.pillarRadius, new HSL(this.settings.pillarHue, this.settings.pillarSaturation, this.settings.pillarLightness)));
        this._selectedPillar = this._pillars.length-1;
    }

    private draw() : void {
        this.setParameters();
        this.drawHelper.draw();
        window.requestAnimationFrame(() => this.draw());
    }

    private setParameters() : void {
        this.settings.lightBrightestHsl.hue = this.settings.lightHue;
        this.settings.lightBrightestHsl.saturation = this.settings.lightSaturation;
        this.settings.lightBrightestHsl.lightness = this.settings.lightBrightest;

        this.settings.lightDarkestHsl.hue = this.settings.lightHue;
        this.settings.lightDarkestHsl.saturation = this.settings.lightSaturation;
        this.settings.lightDarkestHsl.lightness = this.settings.lightDarkest;

        this._lightSource.radius = this.settings.lightSourceRadius;

        this.settings.lightSourceShadowHsla.alpha = this.settings.lightSourceShadowAlpha;
    }

    get settings(): Settings {
        return this._settings;
    }

    get lightSource(): CanvasBall {
        return this._lightSource;
    }

    get pillars(): Pillar[] {
        return this._pillars;
    }

    get selectedPillar(): number {
        return this._selectedPillar;
    }
}