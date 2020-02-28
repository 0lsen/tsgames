import {Ship} from "./Ship";
import {IShip} from "../../interface/IShip";

export class Carrier extends Ship implements IShip {
    size(): number {
        return 5;
    }
}