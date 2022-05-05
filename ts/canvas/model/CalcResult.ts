export class CalcResult {
    readonly coord : number;
    readonly newVelocity : number;
    readonly bounce : boolean;

    constructor(coord: number, newVelocity: number, bounce: boolean) {
        this.coord = coord;
        this.newVelocity = newVelocity;
        this.bounce = bounce;
    }
}