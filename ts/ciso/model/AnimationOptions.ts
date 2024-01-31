export class AnimationOptions {

    readonly values : number[];
    readonly movingFrom : number;
    readonly movingTo : number;
    progress : number;
    readonly swap : boolean;

    constructor(values: number[], movingFrom: number, movingTo: number, progress: number, swap: boolean = false) {
        this.values = values;
        this.movingFrom = movingFrom;
        this.movingTo = movingTo;
        this.progress = progress;
        this.swap = swap;
    }
}