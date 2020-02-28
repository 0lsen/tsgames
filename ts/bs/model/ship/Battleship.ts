import {Ship} from "./Ship";
import {IShip} from "../../interface/IShip";

export class Battleship extends Ship implements IShip {
    size(): number {
        return 4;
    }
}