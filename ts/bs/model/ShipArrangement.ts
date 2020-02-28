import {Coord} from "./Coord";
import {IShip} from "../interface/IShip";

export class ShipArrangement {
    private _ship: IShip;
    private _coord: Coord;


    constructor(ship: IShip, coord: Coord) {
        this._ship = ship;
        this._coord = coord;
    }

    get ship(): IShip {
        return this._ship;
    }

    get coord(): Coord {
        return this._coord;
    }
}