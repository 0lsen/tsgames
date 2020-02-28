import {ShipArrangement} from "../model/ShipArrangement";
import {Opponent} from "./Opponent";
import {State} from "../model/State";

export interface Game {
    placeShips(arrangements: ShipArrangement[], opponent: Opponent): void
    shoot(x: number, y: number, opponent: Opponent): void
    isFinished(): boolean
    reset(): void
    getState(): State
}