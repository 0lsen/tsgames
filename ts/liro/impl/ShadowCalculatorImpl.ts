import {ShadowCalculator} from "../interface/ShadowCalculator";
import {Pillar} from "../model/Pillar";
import {PillarShadow} from "../model/PillarShadow";
import {CanvasBall} from "../../canvas/model/CanvasBall";
import {Coord} from "../../core/model/Coord";

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
        let e1 = this.calcEdgePoint(l1, p1);
        let e2 = this.calcEdgePoint(l2, p2);
        // TODO: if light source has larger radius than pillar the tangents might meet
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

    private calcEdgePoint(lightSourcePoint : Coord, pillarPoint : Coord) : Coord {
        let deltaX = lightSourcePoint.x - pillarPoint.x;
        let deltaY = lightSourcePoint.y - pillarPoint.y;

        if (!deltaX) {
            return new Coord(
                lightSourcePoint.x,
                deltaY > 0 ? 0 : this.dimensions.y
            );
        } else {
            let m = deltaY/deltaX;
            let b = pillarPoint.y-m*pillarPoint.x;
            let edgeX = deltaX > 0 ? 0 : this.dimensions.x;
            return new Coord(
                edgeX,
                m*edgeX+b
            );
        }
    }
}