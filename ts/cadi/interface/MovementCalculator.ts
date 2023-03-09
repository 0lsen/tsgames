import {CalcResult} from "../model/CalcResult";

export interface MovementCalculator {
    setGravityConstant(gravity: number): void;
    calcConstantMovement(currentCoord: number, velocity: number, max: number, radius: number): CalcResult;
    calcAcceleratedMovement(currentCoord: number, velocity: number, max: number, radius: number, direction: number, time : number): CalcResult;
}