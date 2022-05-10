import {Coord as BaseCoord} from "../../core/model/Coord";
import {Coord} from "./Coord";

export class Ball {
    private readonly _radius : number;
    private _coord : BaseCoord;
    private _velocity : BaseCoord = new BaseCoord(0, 0);
    private _color : number;
    private _trail : Coord[] = [];

    constructor(radius: number, coord: BaseCoord, color: number) {
        this._radius = radius;
        this._coord = coord;
        this._color = color;
    }

    changeColor() : void {
        this._color = (this._color+10)%360;
    }

    get radius(): number {
        return this._radius;
    }

    get coord(): BaseCoord {
        return this._coord;
    }

    get velocity(): BaseCoord {
        return this._velocity;
    }

    get color(): number {
        return this._color;
    }

    get trail(): Coord[] {
        return this._trail;
    }

    set trail(value: Coord[]) {
        this._trail = value;
    }
}