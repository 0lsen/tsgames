import {Coord as BaseCoord} from "../../core/model/Coord";
import {Coord} from "./Coord";
import {CanvasBall} from "../../canvas/model/CanvasBall";
import {HSL} from "../../canvas/model/HSL";

export class Ball extends CanvasBall {
    private _mass : number;
    private _velocity : BaseCoord = new BaseCoord(0, 0);
    private _color : HSL;
    private _trail : Coord[] = [];

    constructor(x: number, y: number, radius: number, mass: number, color: HSL) {
        super(x, y, radius);
        this._mass = mass;
        this._color = color;
    }

    changeColor() : void {
        this._color.hue = (this._color.hue+10)%360;
    }

    get mass(): number {
        return this._mass;
    }

    get velocity(): BaseCoord {
        return this._velocity;
    }

    get color(): HSL {
        return this._color;
    }

    get trail(): Coord[] {
        return this._trail;
    }

    set mass(value: number) {
        this._mass = value;
    }

    set trail(value: Coord[]) {
        this._trail = value;
    }
}