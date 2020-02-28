import {Ship} from "./Ship";
import {IShip} from "../../interface/IShip";

export class Destroyer extends Ship implements IShip {
    size(): number {
        return 3;
    }
}