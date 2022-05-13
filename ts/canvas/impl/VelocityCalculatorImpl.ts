import {VelocityCalculator} from "../interface/VelocityCalculator";
import {Coord} from "../model/Coord";
import {Coord as CoreCoord} from "../../core/model/Coord";

export class VelocityCalculatorImpl implements VelocityCalculator {

    private readonly timeThreshold = 0.2;
    private readonly dataThreshold = 10;
    private readonly velocityFactor = 50;
    private readonly maxVelocity = 100;

    calc(coords: Coord[]): CoreCoord {
        let newestTime = coords.at(-1).time;
        let recentCoords = coords.filter(c => (newestTime-c.time)/1000 < this.timeThreshold);
        if (recentCoords.length < this.dataThreshold+1) return null;
        let xs = recentCoords.map(c => c.x);
        let ys = recentCoords.map(c => c.y);
        let times = recentCoords.map(c => c.time);
        let xVelocities = this.velocities(xs, times);
        let yVelocities = this.velocities(ys, times);
        if (xVelocities.length < this.dataThreshold || yVelocities.length < this.dataThreshold) return null;
        let xVelocity = this.averageVelocity(xVelocities)*this.velocityFactor;
        let yVelocity = this.averageVelocity(yVelocities)*this.velocityFactor;
        return new CoreCoord(
            Math.abs(xVelocity) > this.maxVelocity ? this.maxVelocity : xVelocity,
            Math.abs(yVelocity) > this.maxVelocity ? this.maxVelocity : yVelocity
        );
    }

    private velocities(locations : number[], times : number[]) : number[] {
        let velocities : number[] = [];
        locations.forEach((x, i) => {
            if (!i) return;
            velocities.push((x - locations[i-1]) / (times[i] - times[i-1]));
        });
        return velocities.filter(v => Math.abs(v) !== Infinity);
    }

    private averageVelocity(vs : number[]) : number {
        let areMostlyPositive = vs.filter(v => v >= 0).length > vs.length/2;
        let sameSignVs = vs.filter(v => areMostlyPositive ? v >= 0 : v < 0);
        return sameSignVs.reduce((s, x) => s+x)/sameSignVs.length;
    }
}