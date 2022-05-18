import {Coord} from "../../core/model/Coord";

export class MovementResult {
    readonly position : Coord;
    readonly velocity : Coord;
    readonly bounce : boolean;

    constructor(position: Coord, velocity: Coord, bounce: boolean) {
        this.position = position;
        this.velocity = velocity;
        this.bounce = bounce;
    }
}