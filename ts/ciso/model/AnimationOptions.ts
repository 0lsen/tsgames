import {MoveMode} from "../enum/MoveMode";

export class AnimationOptions {

    readonly values : number[];
    readonly movingFrom : number;
    readonly movingTo : number;
    progress : number;
    readonly moveMode : MoveMode;

    constructor(values: number[], movingFrom: number, movingTo: number, progress: number, moveMode: MoveMode = MoveMode.MOVE) {
        this.values = values;
        this.movingFrom = movingFrom;
        this.movingTo = movingTo;
        this.progress = progress;
        this.moveMode = moveMode;
    }
}