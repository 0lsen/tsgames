import {Pillar} from "./model/Pillar";
import {App} from "./App";
import {HSL} from "../canvas/model/HSL";
import {ProgressTransformerImpl} from "./impl/ProgressTransformerImpl";

export class DrawHelper {

    private readonly app : App;
    private readonly progressTransformer = new ProgressTransformerImpl();

    private readonly colorInactive = new HSL(200, 100, 60);
    private readonly colorActive = new HSL(0, 100, 60);
    private readonly rayMargin = 0.2;
    private readonly horizonMargin = 10;
    private readonly horizonRadius = 150;
    private readonly valueScale = 1.1;

    constructor(app: App) {
        this.app = app;
    }

    public draw(pillars : Pillar[], movingFrom : number, movingTo : number, progress : number) : void {
        const numberOfValues = pillars.length;
        const rayWidth = Math.PI*2/numberOfValues;

        pillars.forEach((pillar, i) => {
            if (pillar.height === undefined) return;
            const isInnerRay = i === movingTo;
            this.app.context.lineWidth = isInnerRay ? pillar.height/this.valueScale : pillar.height*this.valueScale;
            this.app.context.strokeStyle = isInnerRay ? this.colorActive.toString() : this.colorInactive.toString();
            const radius = isInnerRay
                ? this.horizonRadius-this.horizonMargin-this.app.context.lineWidth/2
                : this.horizonRadius+this.horizonMargin+this.app.context.lineWidth/2;
            const isMoving = !isInnerRay &&
                movingFrom !== undefined &&
                movingTo !== undefined &&
                i >= Math.min(movingFrom, movingTo) &&
                i <= Math.max(movingFrom, movingTo);
            const offset = - Math.PI/2
                + (isMoving ? Math.sign(movingFrom-movingTo)*rayWidth*this.progressTransformer.transform(progress) : 0)
                + (isInnerRay ? (movingTo-movingFrom)*rayWidth*this.progressTransformer.transform(progress) : 0);
            const index = isInnerRay ? movingFrom : (isMoving ? i+Math.sign(movingTo-movingFrom) : i);
            this.app.context.beginPath();
            this.app.context.arc(
                this.app.dimensions.x/2,
                this.app.dimensions.y/2,
                radius,
                index*rayWidth + rayWidth*this.rayMargin + offset,
                (index+1)*rayWidth - rayWidth*this.rayMargin + offset
            );
            this.app.context.stroke();
            this.app.context.closePath();
        });
    }
}