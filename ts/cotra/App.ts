import {CanvasApp} from "../canvas/CanvasApp";
import {Coord} from "../core/model/Coord";
import {HSLA} from "../canvas/model/HSLA";
import {Phase} from "./enum/Phase";

export class App extends CanvasApp {

    protected _dimensions = new Coord(700, 700);

    private readonly $scale = $('#scale');
    private readonly $rotation = $('#rotation');
    private readonly $x = $('#x');
    private readonly $y = $('#y');
    private readonly $animateSteps = $('#animate');
    private readonly $animateAll = $('#animateAll');

    private readonly $showScale = $('#showScale');
    private readonly $showRotation = $('#showRotation');

    private readonly $s = $('#s');
    private readonly $r = $('#r');
    private readonly $re = $('.re');
    private readonly $im = $('.im');
    private readonly $tx = $('#tx');
    private readonly $ty = $('#ty');
    private readonly $px = $('#px');
    private readonly $py = $('#py');

    private scale : number = 1;
    private rotation : number = 0;
    private translation : Coord = new Coord(0, 0);

    private currentScale : number = 1;
    private currentRotation : number = 1;
    private currentTranslation : number = 1;

    private phase : Phase;
    private timer : number;
    private readonly timePerStep = 3_000;
    private readonly timePerPause = 1_000;

    private readonly gridStrokeStyle = '#333'
    private readonly gridMarkerStrokeStyle = '#999'
    private readonly circleStrokeStyle = '#ccc'
    private readonly squareFillStyle = new HSLA(240, 50, 80, 50);
    private readonly squareStrokeStyle = '#339';
    private readonly illustrationStrokeStyle = '#f00';
    private readonly fontStyle = '12px Arial';

    constructor() {
        super();
        this.rangeValueListener(this.$scale, this.$showScale);
        this.rangeValueListener(this.$rotation, this.$showRotation, (val) => val + ' * \u03C0');
        this.$animateSteps.on('click', () => this.animate(false));
        this.$animateAll.on('click', () => this.animate(true));
        this.$resetButton.on('click', () => this.reset());
    }

    protected init() : void {
        super.init();
        this.draw();
    }

    private reset() : void {
        this.$scale.val(1);
        this.$scale.trigger('change');
        this.$rotation.val(0);
        this.$rotation.trigger('change');
        this.$x.val(0);
        this.$y.val(0);
        this.$animateAll.trigger('click');
    }

    private rangeValueListener($input : JQuery, $showContainer : JQuery, format : (val : string) => string = val => val) : void {
        $input.on('change input', () => {
            $showContainer.val(format($input.val().toString()));
        });
    }

    private animate(all : boolean) : void {
        if (this.phase !== undefined) return;
        this.currentScale = 0;
        this.currentRotation = 0;
        this.currentTranslation = 0;
        this.scale = parseFloat(this.$scale.val().toString());
        this.rotation = parseFloat(this.$rotation.val().toString());
        this.translation = new Coord(parseFloat(this.$x.val().toString()), parseFloat(this.$y.val().toString()));
        if (all) {
            this.phase = Phase.ALL;
        } else if (this.scale !== 1) {
            this.phase = Phase.SCALE;
        } else if (this.rotation !== 0) {
            this.phase = Phase.ROTATION
        } else if (this.translation.x !== 0 || this.translation.y !== 0) {
            this.phase = Phase.TRANSLATION;
        } else {
            this.phase = undefined;
        }
        this.timer = new Date().getTime();
        this.draw();
    }

    private draw() : void {
        this.clear();
        this.drawGrid();
        this.drawCircle();
        this.drawSquare();
        this.fillEquations();
        if (this.phase !== undefined) {
            const timeDiff = new Date().getTime() - this.timer;
            switch (this.phase) {
                case Phase.SCALE:
                    if (timeDiff > this.timePerStep) {
                        this.currentScale = 1;
                        this.timer = new Date().getTime();
                        this.phase = Phase.PAUSE1;
                    } else {
                        this.currentScale = timeDiff / this.timePerStep;
                    }
                    break;
                case Phase.PAUSE1:
                    if (timeDiff > this.timePerPause) {
                        this.timer = new Date().getTime();
                        this.phase = this.rotation !== 0 ? Phase.ROTATION : (this.translation.x !== 0 || this.translation.y !== 0 ? Phase.TRANSLATION : undefined);
                    }
                    break;
                case Phase.ROTATION:
                    if (timeDiff > this.timePerStep) {
                        this.currentRotation = 1;
                        this.timer = new Date().getTime();
                        this.phase = Phase.PAUSE2;
                    } else {
                        this.currentRotation = timeDiff / this.timePerStep;
                    }
                    break;
                case Phase.PAUSE2:
                    if (timeDiff > this.timePerPause) {
                        this.timer = new Date().getTime();
                        this.phase = this.translation.x !== 0 || this.translation.y !== 0 ? Phase.TRANSLATION : undefined;
                    }
                    break;
                case Phase.TRANSLATION:
                    if (timeDiff > this.timePerStep) {
                        this.currentTranslation = 1;
                        this.timer = new Date().getTime();
                        this.phase = Phase.PAUSE3;
                    } else {
                        this.currentTranslation = timeDiff / this.timePerStep;
                    }
                    break;
                case Phase.PAUSE3:
                    if (timeDiff > this.timePerPause) {
                        this.phase = undefined;
                    }
                    break;
                case Phase.ALL:
                    if (timeDiff > this.timePerStep) {
                        this.timer = new Date().getTime();
                        this.currentScale = 1;
                        this.currentRotation = 1;
                        this.currentTranslation = 1;
                        this.phase = Phase.PAUSE4;
                    } else {
                        this.currentScale = timeDiff / this.timePerStep;
                        this.currentRotation = timeDiff / this.timePerStep;
                        this.currentTranslation = timeDiff / this.timePerStep;
                    }
                    break;
                case Phase.PAUSE4:
                    if (timeDiff > this.timePerPause) {
                        this.phase = undefined;
                    }
                    break;
            }
            this.drawIllustration();
            window.requestAnimationFrame(() => this.draw());
        }
    }

    private drawGrid() : void {
        this.context.strokeStyle = this.gridStrokeStyle;
        this.context.lineWidth = .5;

        this.context.beginPath();
        this.context.moveTo(0, this.dimensions.y/2);
        this.context.lineTo(this.dimensions.x, this.dimensions.y/2);
        this.context.stroke();

        this.context.beginPath();
        this.context.moveTo(this.dimensions.x/2, 0);
        this.context.lineTo(this.dimensions.x/2, this.dimensions.y);
        this.context.stroke();

        this.context.strokeStyle = this.gridMarkerStrokeStyle;

        for (let i = 1; i < this.dimensions.x/50; i++) {
            if (i*50 === this.dimensions.x/2) {
                continue;
            }
            this.context.beginPath();
            this.context.moveTo(i*50, this.dimensions.y/2);
            this.context.lineTo(i*50, this.dimensions.y/2+10);
            this.context.stroke();
        }

        for (let i = 1; i < this.dimensions.y/50; i++) {
            if (i*50 === this.dimensions.y/2) {
                continue;
            }
            this.context.beginPath();
            this.context.moveTo(this.dimensions.x/2, i*50);
            this.context.lineTo(this.dimensions.x/2-10, i*50);
            this.context.stroke();
        }
    }

    private drawCircle() : void {
        this.context.strokeStyle = this.circleStrokeStyle;
        this.context.beginPath();
        this.context.arc(this.calcCurrentCenter().x, this.calcCurrentCenter().y, 50*this.calcScale()*Math.SQRT2, 0, Math.PI*2);
        this.context.stroke();
        this.context.closePath();
    }

    private drawSquare() : void {
        this.context.strokeStyle = this.squareStrokeStyle;
        this.context.fillStyle = this.squareFillStyle.toString();
        this.context.lineWidth = 1;

        const p1 = this.calcPoint(0);
        const p2 = this.calcPoint(1);
        const p3 = this.calcPoint(2);
        const p4 = this.calcPoint(3);

        this.context.beginPath();
        this.context.moveTo(p1.x, p1.y);
        this.context.lineTo(p2.x, p2.y);
        this.context.lineTo(p3.x, p3.y);
        this.context.lineTo(p4.x, p4.y);
        this.context.lineTo(p1.x, p1.y);
        this.context.fill();
        this.context.stroke();
        this.context.closePath();

        this.context.font = this.fontStyle;
        this.context.fillStyle = this.gridMarkerStrokeStyle;
        this.drawText(1, p1);
        this.drawText(2, p2);
        this.drawText(3, p3);
        this.drawText(4, p4);

        this.context.strokeStyle = this.gridMarkerStrokeStyle;
        this.context.beginPath();
        this.context.arc(p1.x, p1.y, 10, 0, Math.PI*2);
        this.context.stroke();
        this.context.closePath();
    }

    private fillEquations() : void {
        const p1 = this.calcPoint(0);

        this.$s.text(this.calcScale().toFixed(1));
        this.$r.text((this.rotation*this.currentRotation).toFixed(1));
        this.$re.text((this.calcScale() * Math.SQRT2 * Math.cos(this.rotation * this.currentRotation * Math.PI + Math.PI/4)).toFixed(2));
        this.$im.text((this.calcScale() * Math.SQRT2 * Math.sin(this.rotation * this.currentRotation * Math.PI + Math.PI/4)).toFixed(2));
        this.$tx.text(((this.calcCurrentCenter().x-this.dimensions.x/2)/50).toFixed(1));
        this.$ty.text((-(this.calcCurrentCenter().y-this.dimensions.y/2)/50).toFixed(1));
        this.$px.text(((p1.x-this.dimensions.x/2)/50).toFixed(2));
        this.$py.text((-(p1.y-this.dimensions.y/2)/50).toFixed(2));
    }

    private drawText(index : number, p : Coord) : void {
        const center = this.calcCurrentCenter();
        const x = (p.x - this.dimensions.x/2)/50;
        const y = -(p.y - this.dimensions.y/2)/50;
        const xDiff = p.x - center.x;
        const xOffset = xDiff === 0 ? 0 : (xDiff > 0 ? 10 : -10);
        this.context.textAlign = xOffset >= 0 ? 'left' : 'right';
        const yDiff = p.y - center.y;
        const yOffset = yDiff === 0 ? 0 : (yDiff > 0 ? 24 : -10);
        this.context.fillText('P'+index+'('+x.toFixed(2)+' , '+y.toFixed(2)+')', p.x + xOffset, p.y + yOffset);
    }

    private drawIllustration() : void {
        if (this.phase === undefined) return
        switch (this.phase) {
            case Phase.SCALE:
            case Phase.PAUSE1:
                this.drawScaleIllustration();
                break;
            case Phase.ROTATION:
            case Phase.PAUSE2:
                this.drawRotationIllustration();
                break;
            case Phase.TRANSLATION:
            case Phase.PAUSE3:
                this.drawTranslationIllustration();
                break;
            case Phase.ALL:
            case Phase.PAUSE4:
                if (this.translation.x !== 0 || this.translation.y !== 0) {
                    this.drawTranslationIllustration();
                }
                if (this.rotation !== 0) {
                    this.drawRotationIllustration();
                }
                if (this.scale !== 1) {
                    this.drawScaleIllustration();
                }
                break;
        }
    }

    private drawScaleIllustration() : void {
        this.context.strokeStyle = this.illustrationStrokeStyle;
        this.context.beginPath();
        this.context.moveTo(this.calcCurrentCenter().x, this.calcCurrentCenter().y);
        this.context.lineTo(
            50 * (this.calcScale() * Math.cos(this.rotation * this.currentRotation * Math.PI)) + this.calcCurrentCenter().x,
            -50 * (this.calcScale() * Math.sin(this.rotation * this.currentRotation * Math.PI)) + this.calcCurrentCenter().y
        );
        this.context.stroke();
        this.context.closePath();
        this.context.beginPath();
        this.context.moveTo(this.calcCurrentCenter().x, this.calcCurrentCenter().y);
        this.context.lineTo(
            50 * (this.calcScale() * Math.cos(this.rotation * this.currentRotation * Math.PI + Math.PI/2)) + this.calcCurrentCenter().x,
            -50 * (this.calcScale() * Math.sin(this.rotation * this.currentRotation * Math.PI + Math.PI/2)) + this.calcCurrentCenter().y
        );
        this.context.stroke();
        this.context.closePath();
    }

    private drawRotationIllustration() : void {
        this.context.strokeStyle = this.illustrationStrokeStyle;
        const x = 50 * (this.calcScale() * Math.cos(this.rotation * this.currentRotation * Math.PI));
        const y = 50 * (this.calcScale() * Math.sin(this.rotation * this.currentRotation * Math.PI));
        this.context.beginPath();
        this.context.moveTo(this.calcCurrentCenter().x, this.calcCurrentCenter().y);
        this.context.lineTo(x + this.calcCurrentCenter().x, -y + this.calcCurrentCenter().y);
        this.context.stroke();
        this.context.closePath();
        this.context.beginPath();
        this.context.moveTo(this.calcCurrentCenter().x, this.calcCurrentCenter().y);
        this.context.lineTo(this.calcCurrentCenter().x + 50*this.calcScale(), this.calcCurrentCenter().y);
        this.context.stroke();
        this.context.closePath();
        this.context.beginPath();
        this.context.arc(this.calcCurrentCenter().x, this.calcCurrentCenter().y, 25 * this.calcScale(),  0, -this.rotation * this.currentRotation * Math.PI, this.rotation > 0);
        this.context.stroke();
        this.context.closePath();
    }

    private drawTranslationIllustration() : void {
        this.context.strokeStyle = this.illustrationStrokeStyle;
        this.context.beginPath();
        this.context.moveTo(this.dimensions.x/2, this.dimensions.y/2);
        this.context.lineTo(this.calcCurrentCenter().x, this.calcCurrentCenter().y);
        this.context.stroke();
        this.context.closePath();
    }

    private calcPoint(index : number) : Coord {
        return new Coord(
            50 * (this.calcScale() * Math.SQRT2 * Math.cos(this.rotation * this.currentRotation * Math.PI + Math.PI/4 + index * Math.PI/2)) + this.calcCurrentCenter().x,
            -50 * (this.calcScale() * Math.SQRT2 * Math.sin(this.rotation * this.currentRotation * Math.PI + Math.PI/4 + index * Math.PI/2)) + this.calcCurrentCenter().y
        );
    }

    private calcScale() : number {
        return this.scale*(1+this.currentScale*(this.scale-1))/this.scale;
    }

    private calcCurrentCenter() : Coord {
        return new Coord(50 * this.translation.x * this.currentTranslation + this.dimensions.x/2, -50 * (this.translation.y * this.currentTranslation) + this.dimensions.y/2);
    }
}