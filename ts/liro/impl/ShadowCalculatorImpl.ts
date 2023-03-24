import {ShadowCalculator} from "../interface/ShadowCalculator";
import {Pillar} from "../model/Pillar";
import {PillarShadow} from "../model/PillarShadow";
import {CanvasBall} from "../../canvas/model/CanvasBall";
import {Coord} from "../../core/model/Coord";
import {Line} from "../model/Line";
import {CanvasTools} from "../../canvas/CanvasTools";
import {QuadraticFormulaSolverImpl} from "../../core/impl/QuadraticFormulaSolverImpl";
import {HSL} from "../../canvas/model/HSL";

declare const DEBUG;

export class ShadowCalculatorImpl implements ShadowCalculator {

    private readonly quadraticFormulaSolver = new QuadraticFormulaSolverImpl();

    private readonly dimensions : Coord;
    private readonly context : CanvasRenderingContext2D;
    private readonly lightSource : CanvasBall;
    private readonly lightBrightestHsl : HSL;
    private readonly lightDarkestHsl : HSL;
    private readonly pillarHsl : HSL;

    constructor(dimensions: Coord, context: CanvasRenderingContext2D, lightSource: CanvasBall, lightBrightestHsl: HSL, lightDarkestHsl: HSL, pillarHsl: HSL) {
        this.dimensions = dimensions;
        this.context = context;
        this.lightSource = lightSource;
        this.lightBrightestHsl = lightBrightestHsl;
        this.lightDarkestHsl = lightDarkestHsl;
        this.pillarHsl = pillarHsl;
    }

    calcPillarShadow(pillar: Pillar, otherPillars: Pillar[]): PillarShadow {
        let p1 = this.calcTangentPoint(pillar, false, false);
        let p2 = this.calcTangentPoint(pillar, true, false);
        let l1 = this.calcTangentPoint(pillar, false, true);
        let l2 = this.calcTangentPoint(pillar, true, true);
        let e1 = this.lightSource.radius > pillar.radius ? this.calcMeetingPoint(l1, p1, l2, p2) : this.calcEdgePoint(l1, p1);
        let e2 = this.lightSource.radius > pillar.radius ? e1 : this.calcEdgePoint(l2, p2);
        let shadow = new PillarShadow(p1, p2, e1, e2);

        if (typeof DEBUG !== 'undefined' && DEBUG) {
            this.context.strokeStyle = '#fcc';
            this.context.beginPath();
            this.context.moveTo(l1.x, l1.y);
            this.context.lineTo(p1.x, p1.y);
            this.context.stroke();
            this.context.closePath();
            this.context.strokeStyle = '#f00';
            this.context.beginPath();
            this.context.moveTo(p1.x, p1.y);
            this.context.lineTo(e1.x, e1.y);
            this.context.stroke();
            this.context.closePath();
            this.context.strokeStyle = '#cfc';
            this.context.beginPath();
            this.context.moveTo(l2.x, l2.y);
            this.context.lineTo(p2.x, p2.y);
            this.context.stroke();
            this.context.closePath();
            this.context.strokeStyle = '#0f0';
            this.context.beginPath();
            this.context.moveTo(p2.x, p2.y);
            this.context.lineTo(e2.x, e2.y);
            this.context.stroke();
            this.context.closePath();
        }

        for (let i = 0; i < otherPillars.length; i++) {
            let other = otherPillars[i].shadow;
            if (this.isFullyEnclosed(shadow, other)) {
                return undefined;
            }
            this.calcPartiallyEnclosed(pillar, shadow, other);
        }

        return shadow;
    }

    calcPillarGradient(pillar: Pillar, lightSourceMaxReach : number): CanvasGradient {
        let distancePillarLightSource = CanvasTools.distance(pillar, this.lightSource);
        let distanceMax = (CanvasTools.distance(new Coord(0, 0), new Coord(this.dimensions.x, this.dimensions.y))*lightSourceMaxReach/100);
        let darkeningFactor1 = (distancePillarLightSource-pillar.radius)/distanceMax;
        let darkeningFactor2 = (distancePillarLightSource+pillar.radius)/distanceMax;

        let line = new Line(this.lightSource, pillar);
        let x1 : number;
        let x2 : number;
        let y1 : number;
        let y2 : number;
        if (line.m === undefined) {
            x1 = line.b;
            x2 = line.b;
            y1 = pillar.y+(pillar.y > this.lightSource.y ? -1 : 1)*pillar.radius;
            y2 = pillar.y+(pillar.y > this.lightSource.y ? 1 : -1)*pillar.radius;
        } else {
            let intersectingX = this.quadraticFormulaSolver.solveAll(
                1+line.m*line.m,
                2*(line.m*line.b - pillar.x - line.m*pillar.y),
                pillar.x*pillar.x + pillar.y*pillar.y + line.b*line.b - 2*line.b*pillar.y - pillar.radius*pillar.radius
            );
            x1 = intersectingX[this.lightSource.x > pillar.x ? 0 : 1];
            x2 = intersectingX[this.lightSource.x > pillar.x ? 1 : 0];
            y1 = line.yForX(x1);
            y2 = line.yForX(x2);
        }

        let gradient = this.context.createLinearGradient(x1, y1, x2, y2);
        gradient.addColorStop(0, this.pillarHsl.darken(darkeningFactor1).toString());
        gradient.addColorStop(1, this.pillarHsl.darken(darkeningFactor2).toString());
        return gradient;
    }

    calcLightSourceGradient(lightSourceMaxReach : number) : CanvasGradient {
        let maxDim = Math.max(this.dimensions.x, this.dimensions.y);
        let gradient = this.context.createRadialGradient(
            this.lightSource.x,
            this.lightSource.y,
            this.lightSource.radius,
            this.lightSource.x,
            this.lightSource.y,
            this.lightSource.radius+maxDim*lightSourceMaxReach/100
        );
        gradient.addColorStop(0, this.lightBrightestHsl.toString());
        gradient.addColorStop(1, this.lightDarkestHsl.toString());
        return gradient;
    }

    private calcTangentPoint(pillar : CanvasBall, sign : boolean, lightsource : boolean) : Coord {
        let gamma = -Math.atan((pillar.y-this.lightSource.y)/(pillar.x-this.lightSource.x));
        // this sign decision is sketchy as fuck and possibly wrong for lightsource but that one isn't very impactful
        let beta = (pillar.x < this.lightSource.x == sign ? -1 : 1)*Math.asin((pillar.radius-this.lightSource.radius)/Math.sqrt(Math.pow(pillar.x-this.lightSource.x, 2)+Math.pow(pillar.y-this.lightSource.y, 2)));
        let alpha = gamma-beta;
        return new Coord(
            (lightsource ? this.lightSource.x : pillar.x) + (sign ? 1 : -1)*(lightsource ? this.lightSource.radius : pillar.radius)*Math.sin(alpha),
            (lightsource ? this.lightSource.y : pillar.y) + (sign ? 1 : -1)*(lightsource ? this.lightSource.radius : pillar.radius)*Math.cos(alpha)
        );
    }

    private calcMeetingPoint(ligthSourcePoint1 : Coord, pillarPoint1 : Coord, ligthSourcePoint2 : Coord, pillarPoint2 : Coord) : Coord {
        let line1 = new Line(ligthSourcePoint1, pillarPoint1);
        let line2 = new Line(ligthSourcePoint2, pillarPoint2);
        let x : number;
        let y : number;
        if (line1.m === undefined) {
            x = line1.b;
            y = line2.yForX(x);
        } else if (line2.m === undefined) {
            x = line2.b;
            y = line1.yForX(x);
        } else {
            x = (line2.b-line1.b)/(line1.m-line2.m);
            y = line1.yForX(x);
        }
        return new Coord(x, y);
    }

    private calcEdgePoint(lightSourcePoint : Coord, pillarPoint : Coord) : Coord {
        let line = new Line(lightSourcePoint, pillarPoint);

        if (line.m === undefined) {
            return new Coord(
                lightSourcePoint.x,
                lightSourcePoint.y - pillarPoint.y > 0 ? 0 : this.dimensions.y
            );
        } else {
            let edgeX = lightSourcePoint.x - pillarPoint.x > 0 ? 0 : this.dimensions.x;
            return new Coord(
                edgeX,
                line.yForX(edgeX)
            );
        }
    }

    private isFullyEnclosed(shadow : PillarShadow, other : PillarShadow) : boolean {
        if (other === undefined) return false;

        let secant = new Line(shadow.pillarEdge1, shadow.pillarEdge2);
        let line1 = new Line(other.pillarEdge1, other.canvasEdge1);
        let line2 = new Line(other.pillarEdge2, other.canvasEdge2);
        let minShadowX = Math.min(shadow.pillarEdge1.x, shadow.pillarEdge2.x);
        let maxShadowX = Math.max(shadow.pillarEdge1.x, shadow.pillarEdge2.x);
        let x1 : number;
        let x2 : number;
        if (secant.m === undefined) {
            if (line1.m === undefined || line2.m === undefined) {
                return false;
            }
            x1 = secant.b;
            x2 = secant.b;
        } else {
            x1 = line1.m === undefined ? line1.b : (line1.b - secant.b)/(secant.m - line1.m);
            x2 = line2.m === undefined ? line2.b : (line2.b - secant.b)/(secant.m - line2.m);
        }
        let minOtherX = Math.min(x1, x2);
        let maxOtherX = Math.max(x1, x2);

        if (typeof DEBUG !== 'undefined' && DEBUG) {
            this.context.strokeStyle = '#00f';
            this.context.beginPath();
            this.context.moveTo(x1, secant.yForX(x1));
            this.context.lineTo(x2, secant.yForX(x2));
            this.context.stroke();
            this.context.closePath();
        }

        return minShadowX >= minOtherX && maxShadowX <= maxOtherX &&
            Math.sign(other.canvasEdge1.x - other.pillarEdge1.x) == Math.sign(x1 - other.pillarEdge1.x) &&
            Math.sign(other.canvasEdge2.x - other.pillarEdge2.x) == Math.sign(x2 - other.pillarEdge2.x) &&
            (line1.m !== undefined || Math.sign(other.canvasEdge1.y-other.pillarEdge1.y) == Math.sign(secant.yForX(x1) - other.pillarEdge1.y)) &&
            (line2.m !== undefined || Math.sign(other.canvasEdge2.y-other.pillarEdge2.y) == Math.sign(secant.yForX(x2) - other.pillarEdge2.y)) &&
            (secant.m !== undefined || (Math.min(line1.yForX(x1), line2.yForX(x1)) <= Math.min(shadow.pillarEdge1.y, shadow.pillarEdge2.y) && Math.max(line1.yForX(x1), line2.yForX(x1)) >= Math.max(shadow.pillarEdge1.y, shadow.pillarEdge2.y)));
    }

    private calcPartiallyEnclosed(pillar : Pillar, shadow : PillarShadow, other : PillarShadow) : void {
        // TODO: if one of other's lines is a secant of pillar circle and constricts pillar's shadow calc new pillar shadow line
    }
}