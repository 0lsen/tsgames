import {HSL} from "../../canvas/model/HSL";

export class ArcOptions {

    readonly width : number;
    readonly color : HSL;
    readonly radius : number;
    readonly startAngle : number;

    constructor(width: number, color: HSL, radius: number, startAngle: number) {
        this.width = width;
        this.color = color;
        this.radius = radius;
        this.startAngle = startAngle;
    }
}