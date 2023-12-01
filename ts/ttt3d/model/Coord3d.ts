import {Coord} from "../../core/model/Coord";

export class Coord3d extends Coord {

    private _z : number;

    constructor(x: number, y: number, z: number) {
        super(x, y);
        this._z = z;
    }

    get z(): number {
        return this._z;
    }
}