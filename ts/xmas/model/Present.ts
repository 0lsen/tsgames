import {Coord} from "../../core/model/Coord";
import {HSL} from "../../canvas/model/HSL";

export class Present extends Coord {

    private _velocity : Coord;
    private _currentRotation : number = 0;
    private readonly rotationSpeed : number;
    private readonly _color : HSL;

    constructor(x: number, y: number, velocity: Coord, rotationSpeed : number, hue : number) {
        super(x, y);
        this._velocity = velocity;
        this.rotationSpeed = rotationSpeed;
        this._color = new HSL(hue, 100, 50);
    }

    get velocity(): Coord {
        return this._velocity;
    }

    get currentRotation(): number {
        return this._currentRotation;
    }

    get color(): HSL {
        return this._color;
    }

    public rotate() {
        this._currentRotation += this.rotationSpeed;
    }
}