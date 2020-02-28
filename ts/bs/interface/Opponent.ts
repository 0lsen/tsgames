import {Board} from "./Board";
import {Setup} from "../model/Setup";
import {Shot} from "../model/Shot";

export interface Opponent {
    placeShipsOn(board: Board, setup: Setup): void
    shootAt(board: Board, shot: Shot, setup: Setup): void
}