import {Ship} from "./Ship";
import {IShip} from "../../interface/IShip";

export class Patrol extends Ship implements IShip {
    size(): number {
        return 2;
    }
}