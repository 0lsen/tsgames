import {ShadowCalculator} from "../interface/ShadowCalculator";
import {Pillar} from "../model/Pillar";
import {PillarShadow} from "../model/PillarShadow";
import {CanvasBall} from "../../canvas/model/CanvasBall";
import {Coord} from "../../core/model/Coord";
import {Line} from "../model/Line";
import {CanvasTools} from "../../canvas/CanvasTools";
import {QuadraticFormulaSolverImpl} from "../../core/impl/QuadraticFormulaSolverImpl";
import {HSL} from "../../canvas/model/HSL";

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
        // TODO: check (partly) enclosing shadows
        return new PillarShadow(p1, p2, e1, e2);
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
}