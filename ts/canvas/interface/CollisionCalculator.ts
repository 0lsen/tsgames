import {Ball} from "../model/Ball";
import {Direction} from "../../core/enum/Direction";
import {CollisionResult} from "../model/CollisionResult";

export interface CollisionCalculator {
    checkCollision(balls: Ball[], movingBall: Ball, gravityDirection : Direction) : CollisionResult | null;
    calculatePostCollisionVelocities(ball1: Ball, ball2: Ball, gravityDirection : Direction) : void;
}