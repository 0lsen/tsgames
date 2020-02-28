import {HitMap} from "../model/HitMap";
import {ShipArrangement} from "../model/ShipArrangement";

export interface Board {
    size(): number
    isBeaten(): boolean
    addShip(arrangement: ShipArrangement): void
    shoot(x: number, y: number): boolean
    getHitMap(): HitMap
    getShips(): ShipArrangement[]
}