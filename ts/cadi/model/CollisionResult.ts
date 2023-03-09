import {Ball} from "./Ball";

export class CollisionResult {
    readonly collidingBall : Ball;
    readonly time : number;

    constructor(collidingBall: Ball, time: number) {
        this.collidingBall = collidingBall;
        this.time = time;
    }
}