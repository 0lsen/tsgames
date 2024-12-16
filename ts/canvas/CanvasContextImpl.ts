import {CanvasContext} from "./CanvasContext";

export class CanvasContextImpl implements CanvasContext {

    private readonly context : CanvasRenderingContext2D;

    constructor(context: CanvasRenderingContext2D) {
        this.context = context;
    }

    set fillStyle(value: string | CanvasGradient | CanvasPattern) {
        this.context.fillStyle = value;
    }

    set shadowBlur(value: number) {
        this.context.shadowBlur = value;
    }

    set shadowColor(value: string) {
       this.context.shadowColor = value;
    }

    set strokeStyle(value: string | CanvasGradient | CanvasPattern) {
        this.context.strokeStyle = value;
    }

    set lineWidth(value : number) {
        this.context.lineWidth = value;
    }

    set textAlign(value : "center" | "end" | "left" | "right" | "start") {
        this.context.textAlign = value;
    }

    set font(value : string) {
        this.context.font = value;
    }

    arc(x: number, y: number, radius: number, startAngle: number = 0, endAngle: number = 0, counterclockwise: boolean = false): void {
        this.context.arc(x, y, radius, startAngle, endAngle, counterclockwise);
    }

    beginPath(): void {
        this.context.beginPath();
    }

    clearRect(x: number, y: number, w: number, h: number): void {
        this.context.clearRect(x, y, w, h);
    }

    closePath(): void {
        this.context.closePath();
    }

    fill(): void {
        this.context.fill();
    }

    fillText(text: string, x: number, y: number): void {
        this.context.fillText(text, x, y);
    }

    lineTo(x: number, y: number): void {
        this.context.lineTo(x, y);
    }

    moveTo(x: number, y: number): void {
        this.context.moveTo(x, y);
    }

    rect(x: number, y: number, w: number, h: number): void {
        this.context.rect(x, y, w, h);
    }

    stroke(): void {
        this.context.stroke();
    }

    createLinearGradient(x1: number, y1: number, x2: number, y2: number): CanvasGradient {
        return this.context.createLinearGradient(x1, y1, x2, y2);
    }

    createRadialGradient(x1: number, y1: number, r1: number, x2: number, y2: number, r2: number): CanvasGradient {
        return this.context.createRadialGradient(x1, y1, r1, x2, y2, r2);
    }

    restore(): void {
        this.context.restore();
    }

    save(): void {
        this.context.save();
    }

    scale(x: number, y: number): void {
        this.context.scale(x, y);
    }
}