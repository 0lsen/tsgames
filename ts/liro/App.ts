import {Coord} from "../core/model/Coord";
import {CanvasApp} from "../canvas/CanvasApp";
import {CanvasBall} from "../canvas/model/CanvasBall";
import {CanvasTools} from "../canvas/CanvasTools";
import {HSL} from "../canvas/model/HSL";
import {HSLA} from "../canvas/model/HSLA";
import {Pillar} from "./model/Pillar";
import {ShadowCalculator} from "./interface/ShadowCalculator";
import {ShadowCalculatorImpl} from "./impl/ShadowCalculatorImpl";

export class App extends CanvasApp {

    protected readonly dimensions = new Coord(700, 700);

    private readonly shadowCalculator : ShadowCalculator;

    private lightHue = 30;
    private lightSaturation = 70;
    private lightBrightest = 90;
    private readonly lightDarkest = 0;
    private lightBrightestHsl : HSL;
    private lightDarkestHsl : HSL;

    private lightSourceRadius = 10;
    private lightSourceMaxReach = 70;
    private readonly lightSourceGrabMargin = 20;

    private pillarHue = 130;
    private pillarSaturation = 10;
    private pillarLightness = 30;
    private pillarHsl : HSL;

    private readonly pillarShadowHue = 130;
    private readonly pillarShadowSaturation = 0;
    private readonly pillarShadowLightness = 0;
    private readonly pillarShadowAlpha = 30;
    private readonly pillarShadowHsla = new HSLA(this.pillarShadowHue, this.pillarShadowSaturation, this.pillarShadowLightness, this.pillarShadowAlpha);

    private pillarRadius = 30;

    private readonly $lsHue = $('#lsHue');
    private readonly $lsSat = $('#lsSat');
    private readonly $lsLig = $('#lsLig');
    private readonly $lsRad = $('#lsRad');
    private readonly $lsRea = $('#lsRea');

    private readonly $piHue = $('#piHue');
    private readonly $piSat = $('#piSat');
    private readonly $piLig = $('#piLig');
    private readonly $piRad = $('#piRad');

    private lightSource : CanvasBall;
    private grabbingLightSource : boolean = false;

    private pillars : Pillar[] = [];
    private grabbingPillar : number = undefined;

    constructor() {
        super();
        this.lightSource = new CanvasBall(this.dimensions.x/2, this.dimensions.y/2, this.lightSourceRadius);
        this.shadowCalculator = new ShadowCalculatorImpl(this.dimensions, this.lightSource);

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

    private mouseDown(e : MouseEvent) : void {
        let mouseCoord = this.getMouseCoord(e);
        if (CanvasTools.isBallGrab(mouseCoord, this.lightSource, this.lightSourceGrabMargin)) {
            this.grabbingLightSource = true;
            this.grabbingPillar = undefined;
        } else {
            this.grabbingLightSource = false;
            let pillar = this.pillars.find(p => CanvasTools.isBallGrab(mouseCoord, p));
            if (pillar !== undefined) {
                this.grabbingPillar = this.pillars.indexOf(pillar);
            } else {
                this.grabbingPillar = undefined;
                if (this.noCollision(mouseCoord, undefined)) {
                    this.createPillar(mouseCoord);
                    this.draw();
                }
            }
        }
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
        this.pillars.push(new Pillar(coord.x, coord.y, this.pillarRadius));
    }

    private draw() : void {
        this.context.clearRect(0, 0, this.dimensions.x, this.dimensions.y);
        this.setParameters();
        this.drawLightSource();
        let sortedPillars = this.sortPillars();
        this.calculatePillarShadows(sortedPillars);
        sortedPillars.reverse();
        this.drawPillars(sortedPillars);
    }

    private setParameters() : void {
        this.lightBrightestHsl = new HSL(this.lightHue, this.lightSaturation, this.lightBrightest);
        this.lightDarkestHsl = new HSL(this.lightHue, this.lightSaturation, this.lightDarkest);
        this.lightSource.radius = this.lightSourceRadius;

        this.pillarHsl = new HSL(this.pillarHue, this.pillarSaturation, this.pillarLightness);
    }

    private drawLightSource() : void {
        let maxDim = Math.max(this.dimensions.x, this.dimensions.y);
        let gradient = this.context.createRadialGradient(
            this.lightSource.x,
            this.lightSource.y,
            this.lightSource.radius,
            this.lightSource.x,
            this.lightSource.y,
            this.lightSource.radius+maxDim*this.lightSourceMaxReach/100
        );
        gradient.addColorStop(0, this.lightBrightestHsl.toString());
        gradient.addColorStop(1, this.lightDarkestHsl.toString());
        this.context.fillStyle = gradient;
        this.context.beginPath();
        this.context.rect(0, 0, this.dimensions.x, this.dimensions.y);
        this.context.fill();
        this.context.closePath();
    }

    private sortPillars() : Pillar[] {
        return [...this.pillars].sort((p1, p2) => CanvasTools.distance(p1, this.lightSource) - CanvasTools.distance(p2, this.lightSource));
    }

    private drawPillars(pillars : Pillar[]) : void {
        pillars.forEach(p => this.drawPillar(p));
    }

    private calculatePillarShadows(pillars : Pillar[]) : void {
        pillars.forEach((p, i) => p.shadow = this.shadowCalculator.calcShadow(p, pillars.slice(0, i-1)));
    }

    private drawPillar(pillar : Pillar) : void {
        this.context.fillStyle = this.pillarShadowHsla.toString();
        this.context.shadowBlur = 20;
        this.context.shadowColor = this.pillarShadowHsla.toString();

        this.context.beginPath();
        this.context.moveTo(pillar.shadow.pillarEdge1.x, pillar.shadow.pillarEdge1.y);
        this.context.lineTo(pillar.shadow.canvasEdge1.x, pillar.shadow.canvasEdge1.y);
        //todo: corner point if necessary
        this.context.lineTo(pillar.shadow.canvasEdge2.x, pillar.shadow.canvasEdge2.y);
        this.context.lineTo(pillar.shadow.pillarEdge2.x, pillar.shadow.pillarEdge2.y);
        this.context.lineTo(pillar.shadow.pillarEdge1.x, pillar.shadow.pillarEdge1.y);
        this.context.fill();
        this.context.closePath();

        let darkeningFactor = CanvasTools.distance(pillar, this.lightSource)/(CanvasTools.distance(new Coord(0, 0), new Coord(this.dimensions.x, this.dimensions.y))*this.lightSourceMaxReach/100);
        this.context.fillStyle = this.pillarHsl.darken(darkeningFactor).toString();
        this.context.shadowBlur = 0;
        this.context.beginPath();
        this.context.arc(pillar.x, pillar.y, pillar.radius, 0, 2*Math.PI);
        this.context.fill();
        this.context.closePath();
    }
}