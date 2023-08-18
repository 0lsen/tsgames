import {Pillar} from "./model/Pillar";
import {CanvasTools} from "../canvas/CanvasTools";
import {PillarShadow} from "./model/PillarShadow";
import {HSLA} from "../canvas/model/HSLA";
import {ShadowCalculator} from "./interface/ShadowCalculator";
import {ShadowCalculatorImpl} from "./impl/ShadowCalculatorImpl";
import {App} from "./App";
import {FlickerSectionCalculator} from "./interface/FlickerSectionCalculator";
import {CanvasBall} from "../canvas/model/CanvasBall";

declare const DEBUG;

export class DrawHelper {

    private readonly app : App;
    private readonly shadowCalculator : ShadowCalculator;
    private readonly flickerSectionCalculator : FlickerSectionCalculator;

    private readonly selectedPillarStroke = new HSLA(0, 0, 100, 40);
    private readonly gridHsla = new HSLA(0, 0, 100, 30);

    private flickering : number[];

    constructor(app: App, flickerSectionCalculator : FlickerSectionCalculator) {
        this.app = app;
        this.shadowCalculator = new ShadowCalculatorImpl(
            this.app.dimensions,
            this.app.context,
            this.app.lightSource,
            this.app.settings.lightBrightestHsl,
            this.app.settings.lightDarkestHsl
        );
        this.flickerSectionCalculator = flickerSectionCalculator;
        this.flickering = this.flickerSectionCalculator.createSection();
    }

    public draw() : void {
        this.app.context.clearRect(0, 0, this.app.dimensions.x, this.app.dimensions.y);
        this.drawLightSource();
        let sortedPillars = this.sortPillars();
        this.calculatePillarShadows(sortedPillars);
        sortedPillars.reverse();
        this.drawPillars(sortedPillars);
        this.drawGrid();
        this.updateFlickering();
    }

    private drawLightSource() : void {
        this.app.context.fillStyle = this.shadowCalculator.calcLightSourceGradient(this.app.settings.lightSourceMaxReach, this.flickeringFactor());
        this.app.context.beginPath();
        this.app.context.rect(0, 0, this.app.dimensions.x, this.app.dimensions.y);
        this.app.context.fill();
        this.app.context.closePath();
    }

    private sortPillars() : Pillar[] {
        // TODO: .filter those out of light source reach
        return [...this.app.pillars].sort((p1, p2) => CanvasTools.distance(p1, this.flickeringLightSource()) - CanvasTools.distance(p2, this.flickeringLightSource()));
    }

    private calculatePillarShadows(pillars : Pillar[]) : void {
        pillars.forEach((p, i) => p.shadow = this.shadowCalculator.calcPillarShadow(p, pillars.slice(0, i), this.flickeringFactor()));
    }

    private drawPillars(pillars : Pillar[]) : void {
        pillars.forEach(p => this.drawPillar(p));
    }

    private drawPillar(pillar : Pillar) : void {
        this.drawPillarShadow(pillar.shadow);

        this.app.context.fillStyle = this.shadowCalculator.calcPillarGradient(pillar, this.app.settings.lightSourceMaxReach);
        this.app.context.shadowBlur = 0;
        this.app.context.beginPath();
        this.app.context.arc(pillar.x, pillar.y, pillar.radius, 0, 2*Math.PI);
        this.app.context.fill();
        if (this.app.selectedPillar !== undefined && this.app.pillars[this.app.selectedPillar] === pillar) {
            this.app.context.strokeStyle = this.selectedPillarStroke.toString();
            this.app.context.stroke();
        }
        this.app.context.closePath();
    }

    private drawPillarShadow(shadow : PillarShadow) : void {
        if (shadow === undefined) return;

        this.app.context.fillStyle = this.app.settings.lightSourceShadowHsla.toString();
        this.app.context.shadowBlur = 20;
        this.app.context.shadowColor = this.app.settings.lightSourceShadowHsla.toString();

        this.app.context.beginPath();
        this.app.context.moveTo(shadow.pillarEdge1.x, shadow.pillarEdge1.y);
        this.app.context.lineTo(shadow.canvasEdge1.x, shadow.canvasEdge1.y);
        //todo: corner point if necessary
        this.app.context.lineTo(shadow.canvasEdge2.x, shadow.canvasEdge2.y);
        this.app.context.lineTo(shadow.pillarEdge2.x, shadow.pillarEdge2.y);
        this.app.context.lineTo(shadow.pillarEdge1.x, shadow.pillarEdge1.y);
        this.app.context.fill();
        this.app.context.closePath();
    }

    private flickeringFactor() : number {
        return (1+this.flickering[0]);
    }

    private flickeringLightSource() : CanvasBall {
        return new CanvasBall(this.app.lightSource.x, this.app.lightSource.y, this.app.lightSource.radius*this.flickeringFactor());
    }

    private updateFlickering() : void {
        if (this.flickering.length > 1) {
            this.flickering.shift();
        } else {
            this.flickering = this.flickering.concat(this.flickerSectionCalculator.createSection());
        }
    }

    private drawGrid() : void {
        if (typeof DEBUG !== 'undefined' && DEBUG) {
            this.app.context.strokeStyle = this.gridHsla.toString();
            this.app.context.fillStyle = this.gridHsla.toString();
            let offset = 10;
            let step = 100;
            for (let x = step; x < this.app.dimensions.x; x += step) {
                this.app.context.beginPath();
                this.app.context.moveTo(x, 0);
                this.app.context.lineTo(x, this.app.dimensions.y);
                this.app.context.stroke();
                this.app.context.closePath();
                this.app.context.fillText(x.toString(), x+offset, offset);
            }
            for (let y = step; y < this.app.dimensions.y; y += step) {
                this.app.context.beginPath();
                this.app.context.moveTo(0, y);
                this.app.context.lineTo(this.app.dimensions.x, y);
                this.app.context.stroke();
                this.app.context.closePath();
                this.app.context.fillText(y.toString(), offset, y+offset);
            }
        }
    }
}