import {App} from "./App";
import {ArcCalcImpl} from "./impl/ArcCalcImpl";
import {ArcOptions} from "./model/ArcOptions";
import {AnimationOptions} from "./model/AnimationOptions";

export class DrawHelper {

    private readonly app : App;
    private readonly arcCalc = new ArcCalcImpl();
    private readonly arcMargin = 0.2;

    private arcWidth : number;

    constructor(app: App) {
        this.app = app;
    }

    public draw(animationOptions : AnimationOptions, comparisons : number) : void {
        this.arcWidth = Math.PI*2/animationOptions.values.length;
        this.arcCalc.setArcWidth(this.arcWidth);

        animationOptions.values.forEach((value, i) => {
            if (value === undefined) return;
            if (i === animationOptions.movingTo) {
                this.arcCalc.innerArcs(value, animationOptions).forEach(arcOptions => this.drawArc(arcOptions));
            } else if (animationOptions.swap && i === animationOptions.movingFrom) {
                const swapOptions = new AnimationOptions(
                    animationOptions.values,
                    animationOptions.movingTo,
                    animationOptions.movingFrom,
                    animationOptions.progress
                );
                this.arcCalc.innerArcs(value, swapOptions).forEach(arcOptions => this.drawArc(arcOptions));
            } else if (
                !animationOptions.swap &&
                animationOptions.movingFrom !== undefined &&
                animationOptions.movingTo !== undefined &&
                i >= Math.min(animationOptions.movingFrom, animationOptions.movingTo) &&
                i <= Math.max(animationOptions.movingFrom, animationOptions.movingTo)
            ) {
                this.drawArc(this.arcCalc.outerArcMoving(value, i, animationOptions));
            } else {
                this.drawArc(this.arcCalc.outerArcStatic(value, i));
            }
        });

        if (comparisons) {
            this.writeComparisons(comparisons);
        }
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

    private writeComparisons(n : number) : void {
        this.app.context.textAlign = 'center';
        this.app.context.font = '12px Arial';
        this.app.context.fillStyle = '#aaa';
        this.app.context.fillText(n+' comparisons', this.app.dimensions.x/2, this.app.dimensions.y/2);
    }
}