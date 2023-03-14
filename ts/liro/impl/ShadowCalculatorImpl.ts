import {ShadowCalculator} from "../interface/ShadowCalculator";
import {Pillar} from "../model/Pillar";
import {PillarShadow} from "../model/PillarShadow";
import {CanvasBall} from "../../canvas/model/CanvasBall";
import {Coord} from "../../core/model/Coord";
import {Line} from "../model/Line";

export class ShadowCalculatorImpl implements ShadowCalculator {

    private readonly dimensions : Coord;
    private readonly lightSource : CanvasBall;

    constructor(dimensions: Coord, lightSource: CanvasBall) {
        this.dimensions = dimensions;
        this.lightSource = lightSource;
    }

    calcShadow(pillar: Pillar, otherPillars: Pillar[]): PillarShadow {
        let p1 = this.calcTangentPoint(pillar, false, false);
        let p2 = this.calcTangentPoint(pillar, true, false);
        let l1 = this.calcTangentPoint(pillar, false, true);
        let l2 = this.calcTangentPoint(pillar, true, true);
        let e1 = this.lightSource.radius > pillar.radius ? this.calcMeetingPoint(l1, p1, l2, p2) : this.calcEdgePoint(l1, p1);
        let e2 = this.lightSource.radius > pillar.radius ? e1 : this.calcEdgePoint(l2, p2);
        // TODO: check (partly) enclosing shadows
        return new PillarShadow(p1, p2, e1, e2);
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