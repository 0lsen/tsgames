import {MovementResult} from "../model/MovementResult";
import {Ball} from "../model/Ball";
import {Direction} from "../../core/enum/Direction";
import {Coord} from "../../core/model/Coord";

export interface CollisionFreeMovementCalculator {
    calculateMovement(ball : Ball, gravityDirection : Direction, dimensions : Coord, time : number): MovementResult;
}