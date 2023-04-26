import {Coord} from "../core/model/Coord";
import {CanvasApp} from "../canvas/CanvasApp";
import {CanvasBall} from "../canvas/model/CanvasBall";
import {CanvasTools} from "../canvas/CanvasTools";
import {HSL} from "../canvas/model/HSL";
import {HSLA} from "../canvas/model/HSLA";
import {Pillar} from "./model/Pillar";
import {ShadowCalculator} from "./interface/ShadowCalculator";
import {ShadowCalculatorImpl} from "./impl/ShadowCalculatorImpl";
import {PillarShadow} from "./model/PillarShadow";
import {PillarProperty} from "./enum/PillarProperty";

declare const DEBUG;

export class App extends CanvasApp {

    protected readonly dimensions = new Coord(700, 700);

    private readonly shadowCalculator : ShadowCalculator;

    private lightHue = 30;
    private lightSaturation = 70;
    private lightBrightest = 90;
    private readonly lightDarkest = 0;
    private readonly lightBrightestHsl = new HSL(this.lightHue, this.lightSaturation, this.lightBrightest);
    private readonly lightDarkestHsl = new HSL(this.lightHue, this.lightSaturation, this.lightDarkest);

    private lightSourceRadius = 10;
    private lightSourceMaxReach = 70;
    private lightSourceShadowAlpha = 30;
    private readonly lightSourceGrabMargin = 20;

    private pillarHue = 130;
    private pillarSaturation = 30;
    private pillarLightness = 60;
    private pillarRadius = 30;

    private readonly lightSourceShadowHsla = new HSLA(0, 0, 0, this.lightSourceShadowAlpha);

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

    private readonly lightSource : CanvasBall;
    private grabbingLightSource : boolean = false;

    private readonly pillars : Pillar[] = [];
    private grabbingPillar : number = undefined;

    private readonly selectedPillarStroke = new HSLA(0, 0, 100, 40);
    private selectedPillar : number = undefined;

    constructor() {
        super();
        this.lightSource = new CanvasBall(this.dimensions.x/2, this.dimensions.y/2, this.lightSourceRadius);
        this.shadowCalculator = new ShadowCalculatorImpl(
            this.dimensions,
            this.context,
            this.lightSource,
            this.lightBrightestHsl,
            this.lightDarkestHsl
        );

        this.canvas.addEventListener('mousedown', (e) => this.mouseDown(e));
        this.canvas.addEventListener('mousemove', (e) => this.mouseMove(e));
        this.canvas.addEventListener('mouseup', (e) => this.mouseUp(e));

        this.changeListen(this.$lsHue, 'lightHue');
        this.changeListen(this.$lsSat, 'lightSaturation');
        this.changeListen(this.$lsLig, 'lightBrightest');
        this.changeListen(this.$lsRad, 'lightSourceRadius');
        this.changeListen(this.$lsRea, 'lightSourceMaxReach');

        this.changeListen(this.$piHue, 'pillarHue');
        this.changeListen(this.$piSat, 'pillarSaturation');
        this.changeListen(this.$piLig, 'pillarLightness');
        this.changeListen(this.$piRad, 'pillarRadius');
        this.changeListen(this.$lsShadAlpha, 'lightSourceShadowAlpha');

        this.changeListenSelected(this.$piSelHue, PillarProperty.HUE);
        this.changeListenSelected(this.$piSelSat, PillarProperty.SATURATION);
        this.changeListenSelected(this.$piSelLig, PillarProperty.LIGHTNESS);
        this.changeListenSelected(this.$piSelRad, PillarProperty.RADIUS);
        this.$piSelRem.on('click', () => this.removeSelectedPillar());

        this.$piAllHue.on('click', () => this.setAll(PillarProperty.HUE, this.pillarHue));
        this.$piAllSat.on('click', () => this.setAll(PillarProperty.SATURATION, this.pillarSaturation));
        this.$piAllLig.on('click', () => this.setAll(PillarProperty.LIGHTNESS, this.pillarLightness));
        this.$piAllRad.on('click', () => this.setAll(PillarProperty.RADIUS, this.pillarRadius));
        this.$piAllRem.on('click', () => this.removeAllPillars());

    }

    protected init() {
        super.init();
        this.draw();
    }

    private changeListen($input : JQuery, name : string) : void {
        $input.on('change input', () => {
            this[name] = parseInt($input.val().toString());
            this.draw();
        });
    }

    private changeListenSelected($input : JQuery, property : PillarProperty) : void {
        $input.on('change input', () => {
            let value = parseInt($input.val().toString());
            this.setPillarProperty(this.pillars[this.selectedPillar], property, value);
            this.draw();
        });
    }

    private setAll(property : PillarProperty, value : number) : void {
        this.pillars.forEach(p => this.setPillarProperty(p, property, value));
        this.draw();
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
        this.pillars.splice(this.selectedPillar, 1);
        this.draw();
    }

    private removeAllPillars() : void {
        this.pillars.splice(0, this.pillars.length);
        this.draw();
    }

    private setSelectedPillar(index : number|undefined = undefined) : void {
        this.selectedPillar = index;
        if (index === undefined) {
            this.$piSel.hide();
        } else {
            this.$piSel.show();
            this.$piSelHue.val(this.pillars[index].hsl.hue);
            this.$piSelSat.val(this.pillars[index].hsl.saturation);
            this.$piSelLig.val(this.pillars[index].hsl.lightness);
            this.$piSelRad.val(this.pillars[index].radius);
        }
    }

    private mouseDown(e : MouseEvent) : void {
        let mouseCoord = this.getMouseCoord(e);
        if (CanvasTools.isBallGrab(mouseCoord, this.lightSource, this.lightSourceGrabMargin)) {
            this.grabbingLightSource = true;
            this.grabbingPillar = undefined;
            this.setSelectedPillar();
        } else {
            this.grabbingLightSource = false;
            let pillar = this.pillars.find(p => CanvasTools.isBallGrab(mouseCoord, p));
            if (pillar !== undefined) {
                this.grabbingPillar = this.pillars.indexOf(pillar);
                this.setSelectedPillar(this.grabbingPillar);
            } else {
                this.grabbingPillar = undefined;
                if (this.noNewPillarCollision(mouseCoord)) {
                    this.createPillar(mouseCoord);
                    this.setSelectedPillar(this.pillars.length-1);
                } else {
                    this.setSelectedPillar();
                }
            }
        }
        this.draw();
    }

    private mouseMove(e : MouseEvent) : void {
        let mouseCoord = this.getMouseCoord(e);
        if (this.grabbingLightSource && this.noCollision(mouseCoord, undefined)) {
            this.lightSource.x = mouseCoord.x;
            this.lightSource.y = mouseCoord.y;
            this.draw();
        } else if (this.grabbingPillar !== undefined && this.noCollision(mouseCoord, this.grabbingPillar)) {
            this.pillars[this.grabbingPillar].x = mouseCoord.x;
            this.pillars[this.grabbingPillar].y = mouseCoord.y;
            this.draw();
        }
    }

    private mouseUp(e : MouseEvent) : void {
        this.grabbingLightSource = false;
        this.grabbingPillar = undefined;
    }

    private noNewPillarCollision(mouseCoord : Coord) : boolean {
        let newPillar = new CanvasBall(mouseCoord.x, mouseCoord.y, this.pillarRadius);
        return !CanvasTools.isBallCollision(newPillar, this.lightSource) &&
            this.pillars.every(p => !CanvasTools.isBallCollision(newPillar, p));
    }

    private noCollision(mouseCoord : Coord, pillarIndex : number) : boolean {
        let ball = new CanvasBall(
            mouseCoord.x,
            mouseCoord.y,
            pillarIndex === undefined ? this.lightSourceRadius : this.pillars[pillarIndex].radius
        );
        for (let i = 0; i < this.pillars.length; i++) {
            if (i === pillarIndex) continue;
            if (CanvasTools.isBallCollision(ball, this.pillars[i])) {
                return false;
            }
        }
        // TODO: check distance to canvas borders
        return pillarIndex === undefined || !CanvasTools.isBallCollision(ball, this.lightSource);
    }

    private createPillar(coord : Coord) : void {
        this.pillars.push(new Pillar(coord.x, coord.y, this.pillarRadius, new HSL(this.pillarHue, this.pillarSaturation, this.pillarLightness)));
        this.selectedPillar = this.pillars.length-1;
    }

    private draw() : void {
        this.context.clearRect(0, 0, this.dimensions.x, this.dimensions.y);
        this.setParameters();
        this.drawLightSource();
        let sortedPillars = this.sortPillars();
        this.calculatePillarShadows(sortedPillars);
        sortedPillars.reverse();
        this.drawPillars(sortedPillars);
        this.drawGrid();
    }

    private setParameters() : void {
        this.lightBrightestHsl.hue = this.lightHue;
        this.lightBrightestHsl.saturation = this.lightSaturation;
        this.lightBrightestHsl.lightness = this.lightBrightest;

        this.lightDarkestHsl.hue = this.lightHue;
        this.lightDarkestHsl.saturation = this.lightSaturation;
        this.lightDarkestHsl.lightness = this.lightDarkest;

        this.lightSource.radius = this.lightSourceRadius;

        this.lightSourceShadowHsla.alpha = this.lightSourceShadowAlpha;
    }

    private drawLightSource() : void {
        this.context.fillStyle = this.shadowCalculator.calcLightSourceGradient(this.lightSourceMaxReach);
        this.context.beginPath();
        this.context.rect(0, 0, this.dimensions.x, this.dimensions.y);
        this.context.fill();
        this.context.closePath();
    }

    private sortPillars() : Pillar[] {
        // TODO: .filter those out of light source reach
        return [...this.pillars].sort((p1, p2) => CanvasTools.distance(p1, this.lightSource) - CanvasTools.distance(p2, this.lightSource));
    }

    private drawPillars(pillars : Pillar[]) : void {
        pillars.forEach(p => this.drawPillar(p));
    }

    private calculatePillarShadows(pillars : Pillar[]) : void {
        pillars.forEach((p, i) => p.shadow = this.shadowCalculator.calcPillarShadow(p, pillars.slice(0, i)));
    }

    private drawPillar(pillar : Pillar) : void {
        this.drawPillarShadow(pillar.shadow);

        this.context.fillStyle = this.shadowCalculator.calcPillarGradient(pillar, this.lightSourceMaxReach);
        this.context.shadowBlur = 0;
        this.context.beginPath();
        this.context.arc(pillar.x, pillar.y, pillar.radius, 0, 2*Math.PI);
        this.context.fill();
        if (this.selectedPillar !== undefined && this.pillars[this.selectedPillar] === pillar) {
            this.context.strokeStyle = this.selectedPillarStroke.toString();
            this.context.stroke();
        }
        this.context.closePath();
    }

    private drawPillarShadow(shadow : PillarShadow) : void {
        if (shadow === undefined) return;

        this.context.fillStyle = this.lightSourceShadowHsla.toString();
        this.context.shadowBlur = 20;
        this.context.shadowColor = this.lightSourceShadowHsla.toString();

        this.context.beginPath();
        this.context.moveTo(shadow.pillarEdge1.x, shadow.pillarEdge1.y);
        this.context.lineTo(shadow.canvasEdge1.x, shadow.canvasEdge1.y);
        //todo: corner point if necessary
        this.context.lineTo(shadow.canvasEdge2.x, shadow.canvasEdge2.y);
        this.context.lineTo(shadow.pillarEdge2.x, shadow.pillarEdge2.y);
        this.context.lineTo(shadow.pillarEdge1.x, shadow.pillarEdge1.y);
        this.context.fill();
        this.context.closePath();
    }

    private drawGrid() : void {
        if (typeof DEBUG !== 'undefined' && DEBUG) {
            this.context.strokeStyle = 'rgba(255,255,255,0.3)';
            this.context.fillStyle = 'rgba(255,255,255,0.3)';
            let offset = 10;
            let step = 100;
            for (let x = step; x < this.dimensions.x; x += step) {
                this.context.beginPath();
                this.context.moveTo(x, 0);
                this.context.lineTo(x, this.dimensions.y);
                this.context.stroke();
                this.context.closePath();
                this.context.fillText(x.toString(), x+offset, offset);
            }
            for (let y = step; y < this.dimensions.y; y += step) {
                this.context.beginPath();
                this.context.moveTo(0, y);
                this.context.lineTo(this.dimensions.x, y);
                this.context.stroke();
                this.context.closePath();
                this.context.fillText(y.toString(), offset, y+offset);
            }
        }
    }
}