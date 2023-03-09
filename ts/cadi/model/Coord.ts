import {Coord as CoreCoord} from "../../core/model/Coord";

export class Coord extends CoreCoord {
    private _time : number;

    constructor(x: number, y: number, time: number) {
        super(x, y);
        this._time = time;
    }

    get time(): number {
        return this._time;
    }

    set time(value: number) {
        this._time = value;
    }
}