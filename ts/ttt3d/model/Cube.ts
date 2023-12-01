import {Coord3d} from "./Coord3d";
import {InvalidCornerException} from "../exception/InvalidCornerException";

export class Cube {

    private readonly _edgeLength : number;
    protected readonly _center : Coord3d;

    constructor(edgeLength: number, center: Coord3d) {
        this._edgeLength = edgeLength;
        this._center = center;
    }

    get edgeLength(): number {
        return this._edgeLength;
    }

    get center(): Coord3d {
        return this._center;
    }

    getCorners() : Coord3d[] {
        return [...Array(8)].map((i, v) => v).map(i => this.getCorner(i));
    }

    private getCorner(index : number) : Coord3d {
        if (Math.floor(index) !== index || index < 0 || index > 7) {
            throw new InvalidCornerException();
        }
        return new Coord3d(
            ([0, 1, 2, 3].includes(index) ? 1 : -1) * this._edgeLength/2 + this._center.x,
            ([0, 1, 4, 5].includes(index) ? 1 : -1) * this._edgeLength/2 + this._center.y,
            ([0, 2, 4, 6].includes(index) ? 1 : -1) * this._edgeLength/2 + this._center.z
        );
    }
}