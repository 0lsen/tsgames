import {CalcResult} from "../model/CalcResult";

export interface MovementCalculator {
    setGravityConstant(gravity: number);
    calcConstantMovement(currentCoord: number, velocity: number, max: number, radius: number): CalcResult;
    calcAcceleratedMovement(currentCoord: number, velocity: number, max: number, radius: number, direction: number): CalcResult;
}