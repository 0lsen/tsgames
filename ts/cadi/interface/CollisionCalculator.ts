import {Ball} from "../model/Ball";
import {CollisionResult} from "../model/CollisionResult";

export interface CollisionCalculator {
    checkCollision(balls: Ball[], movingBall: Ball) : CollisionResult | null;
    calculatePostCollisionVelocities(ball1: Ball, ball2: Ball) : void;
}