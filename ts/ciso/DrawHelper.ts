import {App} from "./App";
import {ArcCalcImpl} from "./impl/ArcCalcImpl";
import {ArcOptions} from "./model/ArcOptions";
import {AnimationOptions} from "./model/AnimationOptions";
import {MoveMode} from "./enum/MoveMode";

export class DrawHelper {

    private readonly app : App;
    private readonly arcCalc = new ArcCalcImpl();
    private readonly arcMargin = 0.2;
    private readonly comparisonFontSizeDescription = 12;
    private readonly comparisonFontSizeNumber = 30;

    private arcWidth : number;

    constructor(app: App) {
        this.app = app;
    }

    public draw(animationOptions : AnimationOptions, comparisons : number) : void {
        this.arcWidth = Math.PI*2/animationOptions.values.length;
        this.arcCalc.setArcWidth(this.arcWidth);

        animationOptions.values.forEach((value, i) => {
            if (value === undefined) return;

            switch (animationOptions.moveMode) {
                case MoveMode.MOVE:
                    if (i === animationOptions.movingTo) {
                        this.arcCalc.innerArcs(value, animationOptions).forEach(arcOptions => this.drawArc(arcOptions));
                    } else if (this.isOuterArcMoving(animationOptions, i)) {
                        this.drawArc(this.arcCalc.outerArcMoving(value, i, animationOptions));
                    } else {
                        this.drawArc(this.arcCalc.outerArcStatic(value, i));
                    }
                    break;
                case MoveMode.SWAP:
                    if (i === animationOptions.movingTo) {
                        this.arcCalc.innerArcs(value, animationOptions).forEach(arcOptions => this.drawArc(arcOptions));
                    } else if (i === animationOptions.movingFrom) {
                        const swapOptions = new AnimationOptions(
                            animationOptions.values,
                            animationOptions.movingTo,
                            animationOptions.movingFrom,
                            animationOptions.progress
                        );
                        this.arcCalc.innerArcs(value, swapOptions).forEach(arcOptions => this.drawArc(arcOptions));
                    } else {
                        this.drawArc(this.arcCalc.outerArcStatic(value, i));
                    }
                    break;
                case MoveMode.ELIMINATE:
                    if (!i) {
                        animationOptions.progress = animationOptions.progress * (1 - this.arcCalc.transitionPhase);
                    }
                    if (i === animationOptions.movingTo) {
                        this.drawArc(this.arcCalc.outerArcElimination(value, animationOptions));
                    } else if (this.isOuterArcMoving(animationOptions, i)) {
                        this.drawArc(this.arcCalc.outerArcMoving(value, i, animationOptions));
                    } else {
                        this.drawArc(this.arcCalc.outerArcStatic(value, i));
                    }
                    break;
            }
        });

        if (comparisons) {
            this.writeComparisons(comparisons);
        }
    }

    private isOuterArcMoving(animationOptions : AnimationOptions, index : number) : boolean {
        return animationOptions.movingFrom !== undefined &&
            animationOptions.movingTo !== undefined &&
            index >= Math.min(animationOptions.movingFrom, animationOptions.movingTo) &&
            index <= Math.max(animationOptions.movingFrom, animationOptions.movingTo);
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
        this.app.context.fillStyle = '#aaa';
        this.app.context.font = this.comparisonFontSizeNumber+'px Arial';
        this.app.context.fillText(n.toString(), this.app.dimensions.x/2, this.app.dimensions.y/2 - (this.comparisonFontSizeNumber-this.comparisonFontSizeDescription)/2);
        this.app.context.font = this.comparisonFontSizeDescription+'px Arial';
        this.app.context.fillText('comparisons', this.app.dimensions.x/2, this.app.dimensions.y/2 + (this.comparisonFontSizeNumber-this.comparisonFontSizeDescription)/2);
    }
}