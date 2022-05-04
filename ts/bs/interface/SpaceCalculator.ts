import {HitMap} from "../model/HitMap";
import {Orientation} from "../../core/enum/Orientation";

export interface SpaceCalculator {
    buildFreeMap(hitmap: HitMap): boolean[][]
    calculateSpace(x: number, y: number, orientation: Orientation, maxLength: number, freeMap: boolean[][]): number
}