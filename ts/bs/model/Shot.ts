import {Turn} from "../enum/Turn";

export class Shot {
    private _shooter: Turn;
    private _hit: boolean;
    private _x: number;
    private _y: number;

    get shooter(): Turn {
        return this._shooter;
    }

    set shooter(value: Turn) {
        this._shooter = value;
    }

    get hit(): boolean {
        return this._hit;
    }

    set hit(value: boolean) {
        this._hit = value;
    }

    get x(): number {
        return this._x;
    }

    set x(value: number) {
        this._x = value;
    }

    get y(): number {
        return this._y;
    }

    set y(value: number) {
        this._y = value;
    }
}