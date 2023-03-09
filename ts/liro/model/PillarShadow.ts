import {Coord} from "../../core/model/Coord";

export class PillarShadow {
    private _pillarEdge1 : Coord;
    private _pillarEdge2 : Coord;
    private _canvasEdge1 : Coord;
    private _canvasEdge2 : Coord;

    constructor(pillarEdge1: Coord, pillarEdge2: Coord, canvasEdge1: Coord, canvasEdge2: Coord) {
        this._pillarEdge1 = pillarEdge1;
        this._pillarEdge2 = pillarEdge2;
        this._canvasEdge1 = canvasEdge1;
        this._canvasEdge2 = canvasEdge2;
    }

    get pillarEdge1(): Coord {
        return this._pillarEdge1;
    }

    get pillarEdge2(): Coord {
        return this._pillarEdge2;
    }

    get canvasEdge1(): Coord {
        return this._canvasEdge1;
    }

    get canvasEdge2(): Coord {
        return this._canvasEdge2;
    }
}