import {ArcCalc} from "../interface/ArcCalc";
import {ArcOptions} from "../model/ArcOptions";
import {Pillar} from "../model/Pillar";
import {HSL} from "../../canvas/model/HSL";
import {ProgressTransformerImpl} from "./ProgressTransformerImpl";

export class ArcCalcImpl implements ArcCalc {

    private readonly progressTransformer = new ProgressTransformerImpl();

    private readonly colorInactive = new HSL(200, 100, 60);
    private readonly colorActive = new HSL(0, 100, 60);
    private readonly horizonMargin = 10;
    private readonly horizonRadius = 150;
    private readonly valueScale = 1.1;
    private readonly transitionPhase = 0.15;
    private arcWidth : number;

    innerArcs(pillar: Pillar, movingFrom: number, movingTo: number, progress: number): ArcOptions[] {
        if (progress < this.transitionPhase) {
            progress /= this.transitionPhase;
            return [
                new ArcOptions(
                    pillar.height*this.valueScale * (1-progress),
                    this.colorInactive,
                    this.horizonRadius + this.horizonMargin+pillar.height*this.valueScale*(1-progress)/2,
                    movingFrom*this.arcWidth
                ),
                new ArcOptions(
                    (pillar.height/this.valueScale)*progress,
                    this.colorActive,
                    this.horizonRadius-this.horizonMargin-(pillar.height/this.valueScale)*progress/2,
                    movingFrom*this.arcWidth
                ),
            ];
        } else if (progress > 1-this.transitionPhase) {
            progress = (1-progress) / this.transitionPhase;
            return [
                new ArcOptions(
                    (pillar.height/this.valueScale)*progress,
                    this.colorActive,
                    this.horizonRadius-this.horizonMargin-(pillar.height/this.valueScale)*progress/2,
                    movingTo*this.arcWidth
                ),
                new ArcOptions(
                    pillar.height*this.valueScale * (1-progress),
                    this.colorInactive,
                    this.horizonRadius + this.horizonMargin+pillar.height*this.valueScale*(1-progress)/2,
                    movingTo*this.arcWidth
                ),
            ];
        } else {
            return [new ArcOptions(
                pillar.height/this.valueScale,
                this.colorActive,
                this.horizonRadius-this.horizonMargin-(pillar.height/this.valueScale)/2,
                movingFrom*this.arcWidth + (movingTo-movingFrom)*this.arcWidth*this.progressTransformer.transform(progress, this.transitionPhase)
            )];
        }
    }

    outerArcMoving(pillar: Pillar, index: number, movingFrom: number, movingTo: number, progress: number): ArcOptions {
        return new ArcOptions(
            pillar.height*this.valueScale,
            this.colorInactive,
            this.horizonRadius+this.horizonMargin+pillar.height*this.valueScale/2,
            (index+Math.sign(movingTo-movingFrom))*this.arcWidth + Math.sign(movingFrom-movingTo)*this.arcWidth*this.progressTransformer.transform(progress, this.transitionPhase)
        );
    }

    outerArcStatic(pillar: Pillar, index: number): ArcOptions {
        return new ArcOptions(
            pillar.height*this.valueScale,
            this.colorInactive,
            this.horizonRadius+this.horizonMargin+pillar.height*this.valueScale/2,
            index*this.arcWidth)
    }

    setArcWidth(width: number): void {
        this.arcWidth = width;
    }
}