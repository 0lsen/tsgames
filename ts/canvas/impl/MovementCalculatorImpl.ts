import {MovementCalculator} from "../interface/MovementCalculator";
import {CalcResult} from "../model/CalcResult";

export class MovementCalculatorImpl implements MovementCalculator {

    private gravityConstant : number;

    setGravityConstant(gravity: number) {
        this.gravityConstant = gravity;
    }

    calcConstantMovement(currentCoord: number, velocity: number, max: number, radius : number): CalcResult {
        let newCoord : number;
        let newVelocity : number = null;
        let distance = velocity/10;
        if (distance >= 0) {
            if (currentCoord+distance > max-radius) {
                newVelocity = -velocity;
                newCoord = 2*max - distance - 2*radius - currentCoord;
            } else {
                newCoord = currentCoord+distance;
            }
        } else {
            if (currentCoord+distance < radius) {
                newVelocity = -velocity;
                newCoord = 2*radius - distance - currentCoord;
            } else {
                newCoord = currentCoord+distance;
            }
        }
        // TODO: multiple bounces
        return new CalcResult(newCoord, newVelocity, null);
    }

    calcAcceleratedMovement(currentCoord: number, velocity: number, max: number, radius : number, direction: number): CalcResult {
        // TODO: rolling on ground
        let newCoord : number;
        let newVelocity : number;
        let bounce = false;
        let time = 0.1;
        let directionalGravity = this.gravityConstant * (direction < 0 ? -1 : 1);
        let newCoordsWithoutBounds = this.calcAcceleratedCoordByTime(directionalGravity, time, velocity, currentCoord);
        let isAlreadyFalling = !velocity || Math.sign(velocity) == Math.sign(direction);
        if (isAlreadyFalling) {
            if (newCoordsWithoutBounds > max-radius) {
                let timeOfBounce = this.calcAcceleratedTimeByCoord(directionalGravity, max-radius, velocity, currentCoord);
                let velocityAtTimeOfBounce = -this.calcAcceleratedVelocityByTime(directionalGravity, timeOfBounce, velocity);
                let timeAfterBounce = time-timeOfBounce;
                newCoord = this.calcAcceleratedCoordByTime(directionalGravity, timeAfterBounce, velocityAtTimeOfBounce, max-radius);
                newVelocity = this.calcAcceleratedVelocityByTime(directionalGravity, timeAfterBounce, velocityAtTimeOfBounce);
                bounce = true;
            } else if (newCoordsWithoutBounds < radius) {
                let timeOfBounce = this.calcAcceleratedTimeByCoord(directionalGravity, radius, velocity, currentCoord);
                let velocityAtTimeOfBounce = -this.calcAcceleratedVelocityByTime(directionalGravity, timeOfBounce, velocity);
                let timeAfterBounce = time-timeOfBounce;
                newCoord = this.calcAcceleratedCoordByTime(directionalGravity, timeAfterBounce, velocityAtTimeOfBounce, radius);
                newVelocity = this.calcAcceleratedVelocityByTime(directionalGravity, timeAfterBounce, velocityAtTimeOfBounce);
                bounce = true;
            } else {
                newCoord = newCoordsWithoutBounds;
                newVelocity = velocity + directionalGravity*time;
            }
        } else {
            let timeTilPeak = Math.abs(velocity)/this.gravityConstant;
            let peakReached = timeTilPeak < time;
            if (peakReached) {
                let peak = velocity*velocity/(2*directionalGravity) + currentCoord;
                if (peak < radius || peak > max - radius) {
                    if (direction > 0) {
                        let timeOfBounce = this.calcAcceleratedTimeByCoord(directionalGravity, max - radius, velocity, currentCoord);
                        let velocityAtTimeOfBounce = -this.calcAcceleratedVelocityByTime(directionalGravity, timeOfBounce, velocity);
                        let timeAfterBounce = time - timeOfBounce;
                        newCoord = this.calcAcceleratedCoordByTime(directionalGravity, timeAfterBounce, velocityAtTimeOfBounce, max - radius);
                        newVelocity = this.calcAcceleratedVelocityByTime(directionalGravity, timeAfterBounce, velocityAtTimeOfBounce);
                    } else {
                        let timeOfBounce = this.calcAcceleratedTimeByCoord(directionalGravity, radius, velocity, currentCoord);
                        let velocityAtTimeOfBounce = -this.calcAcceleratedVelocityByTime(directionalGravity, timeOfBounce, velocity);
                        let timeAfterBounce = time - timeOfBounce;
                        newCoord = this.calcAcceleratedCoordByTime(directionalGravity, timeAfterBounce, velocityAtTimeOfBounce, radius);
                        newVelocity = this.calcAcceleratedVelocityByTime(directionalGravity, timeAfterBounce, velocityAtTimeOfBounce);
                    }
                    bounce = true;
                } else {
                    newCoord = this.calcAcceleratedCoordByTime(directionalGravity, time, velocity, currentCoord);
                    newVelocity = velocity + directionalGravity*time;
                }
            } else {
                if (newCoordsWithoutBounds > max-radius) {
                    let timeOfBounce = this.calcAcceleratedTimeByCoord(directionalGravity, max - radius, velocity, currentCoord);
                    let velocityAtTimeOfBounce = -this.calcAcceleratedVelocityByTime(directionalGravity, timeOfBounce, velocity);
                    let timeAfterBounce = time - timeOfBounce;
                    newCoord = this.calcAcceleratedCoordByTime(directionalGravity, timeAfterBounce, velocityAtTimeOfBounce, max - radius);
                    newVelocity = this.calcAcceleratedVelocityByTime(directionalGravity, timeAfterBounce, velocityAtTimeOfBounce);
                    bounce = true;
                } else if (newCoordsWithoutBounds < radius) {
                    let timeOfBounce = this.calcAcceleratedTimeByCoord(directionalGravity, radius, velocity, currentCoord);
                    let velocityAtTimeOfBounce = -this.calcAcceleratedVelocityByTime(directionalGravity, timeOfBounce, velocity);
                    let timeAfterBounce = time - timeOfBounce;
                    newCoord = this.calcAcceleratedCoordByTime(directionalGravity, timeAfterBounce, velocityAtTimeOfBounce, radius);
                    newVelocity = this.calcAcceleratedVelocityByTime(directionalGravity, timeAfterBounce, velocityAtTimeOfBounce);
                    bounce = true;
                } else {
                    newCoord = this.calcAcceleratedCoordByTime(directionalGravity, time, velocity, currentCoord);
                    newVelocity = velocity + directionalGravity*time;
                }
            }
        }
        // TODO: multiple bounces
        return new CalcResult(newCoord, newVelocity, bounce);
    }

    private calcAcceleratedTimeByCoord(gravity : number, coord : number, initialVelocity : number, coord0) : number {
        let solution1 = (-initialVelocity + Math.sqrt(initialVelocity*initialVelocity - 2*gravity*(coord0-coord))) / gravity;
        let solution2 = (-initialVelocity - Math.sqrt(initialVelocity*initialVelocity - 2*gravity*(coord0-coord))) / gravity;
        return Math.min(solution1, solution2) > 0 ? Math.min(solution1, solution2) : Math.max(solution1, solution2);
    }

    private calcAcceleratedCoordByTime(gravity : number, time : number, initialVelocity : number, coord0) : number {
        return (gravity*time*time)/2 + initialVelocity*time + coord0;
    }

    private calcAcceleratedVelocityByTime(gravity : number, time : number, initialVelocity : number) : number {
        return gravity*time + initialVelocity;
    }
}