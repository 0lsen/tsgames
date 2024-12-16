export interface CanvasContext {
    clearRect(x: number, y: number, w: number, h: number): void;
    strokeStyle : string | CanvasGradient | CanvasPattern;
    stroke() : void;
    fillStyle : string | CanvasGradient | CanvasPattern;
    fillText(text : string, x : number, y : number) : void;
    textAlign : "center" | "end" | "left" | "right" | "start"
    font : string;
    fill() : void;
    lineWidth : number;
    beginPath() : void;
    closePath() : void;
    moveTo(x : number, y : number) : void;
    lineTo(x : number, y : number) : void;
    arc(x : number, y : number, radius : number, startAngle ?: number, endAngle ?: number, counterclockwise ?: boolean) : void;
    rect(x : number, y : number, w : number, h : number) : void;
    shadowBlur : number;
    shadowColor : string;
    createLinearGradient(x1 : number, y1 : number, x2 : number, y2 : number) : CanvasGradient;
    createRadialGradient(x1 : number, y1 : number, r1 : number, x2 : number, y2 : number, r2 : number) : CanvasGradient;
    scale(x : number, y : number) : void;
    save() : void;
    restore() : void;
}