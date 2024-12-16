import {CanvasContext} from "../../ts/canvas/CanvasContext";
import {CanvasGradientMock} from "./CanvasGradientMock";

export class CanvasContextMock implements CanvasContext {
    fillStyle = '';
    font: string = '';
    lineWidth: number = 1;
    shadowBlur: number = 0;
    shadowColor: string = '';
    strokeStyle = '';
    textAlign: "center" | "end" | "left" | "right" | "start" = 'left';

    arc(x: number, y: number, radius: number, startAngle?: number, endAngle?: number, counterclockwise?: boolean): void {
    }

    beginPath(): void {
    }

    clearRect(x: number, y: number, w: number, h: number): void {
    }

    closePath(): void {
    }

    createLinearGradient(x1: number, y1: number, x2: number, y2: number) {
        return new CanvasGradientMock();
    }

    createRadialGradient(x1: number, y1: number, r1: number, x2: number, y2: number, r2: number) {
        return new CanvasGradientMock();
    }

    fill(): void {
    }

    fillText(text: string, x: number, y: number): void {
    }

    lineTo(x: number, y: number): void {
    }

    moveTo(x: number, y: number): void {
    }

    rect(x: number, y: number, w: number, h: number): void {
    }

    restore(): void {
    }

    save(): void {
    }

    scale(x: number, y: number): void {
    }

    stroke(): void {
    }

}