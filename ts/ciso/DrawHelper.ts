import {Pillar} from "./model/Pillar";
import {App} from "./App";
import {ArcCalcImpl} from "./impl/ArcCalcImpl";
import {ArcOptions} from "./model/ArcOptions";

export class DrawHelper {

    private readonly app : App;
    private readonly arcCalc = new ArcCalcImpl();
    private readonly arcMargin = 0.2;

    private arcWidth : number;

    constructor(app: App) {
        this.app = app;
    }

    public draw(pillars : Pillar[], movingFrom : number, movingTo : number, progress : number) : void {
        this.arcWidth = Math.PI*2/pillars.length;
        this.arcCalc.setArcWidth(this.arcWidth);

        pillars.forEach((pillar, i) => {
            if (pillar.height === undefined) return;
            if (i === movingTo) {
                this.arcCalc.innerArcs(pillar, movingFrom, movingTo, progress).forEach(option => this.drawArc(option));
            } else if (
                movingFrom !== undefined &&
                movingTo !== undefined &&
                i >= Math.min(movingFrom, movingTo) &&
                i <= Math.max(movingFrom, movingTo)
            ) {
                this.drawArc(this.arcCalc.outerArcMoving(pillar, i, movingFrom, movingTo, progress));
            } else {
                this.drawArc(this.arcCalc.outerArcStatic(pillar, i));
            }
        });
    }

    private drawArc(options : ArcOptions) : void {
        if (options.width <= 0) return;
        this.app.context.lineWidth = options.width;
        this.app.context.strokeStyle  = options.color.toString();
        this.app.context.beginPath();
        this.app.context.arc(
            this.app.dimensions.x/2,
            this.app.dimensions.y/2,
            options.radius,
            options.startAngle - Math.PI/2 + this.arcWidth*this.arcMargin,
            options.startAngle - Math.PI/2 - this.arcWidth*this.arcMargin + this.arcWidth
        );
        this.app.context.stroke();
        this.app.context.closePath();
    }
}