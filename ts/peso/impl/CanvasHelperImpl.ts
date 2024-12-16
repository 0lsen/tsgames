import {CanvasHelper} from "../interface/CanvasHelper";
import {Coord} from "../../core/model/Coord";
import {IsometricCalc} from "../interface/IsometricCalc";
import {CanvasContext} from "../../canvas/CanvasContext";

export class CanvasHelperImpl implements CanvasHelper {

    private isometricCalc : IsometricCalc;
    private readonly context : CanvasContext;
    private readonly tileSize : number;

    private readonly yOffset = 20;

    private readonly tileStrokeColor = '#ccc';
    private readonly tileStrokeColorHover = '#666';
    private readonly tileColor = '#eee';
    private readonly tileColorHover = '#ddd';
    private readonly tileColorJumpable = '#ada';
    private readonly tileColorNotJumpable = '#daa';

    private readonly pegWidth = 25;
    private readonly pegHeight = 40;
    private readonly pegRaise = 20;
    private readonly pegShadowColor = '#aaa';
    private readonly pegShadowLength = 0.3;
    private readonly pegLightnessMin = 50;
    private readonly pegLightnessMax = 80;

    private readonly sineAverage = (this.pegLightnessMax+this.pegLightnessMin)/2;
    private readonly sineAmplitude = (this.pegLightnessMax-this.pegLightnessMin)/2;

    public pegShadowRad = 5;

    constructor(isometricCalc: IsometricCalc, context: CanvasContext, tileSize: number) {
        this.isometricCalc = isometricCalc;
        this.context = context;
        this.tileSize = tileSize;
    }

    moveToTileCorner(coord: Coord): void {
        let projection = this.isometricCalc.tileCornerToScreen(coord);
        this.context.moveTo(projection.x, projection.y);
    }

    lineToTileCorner(coord: Coord, useYOffset : boolean = false): void {
        let projection = this.isometricCalc.tileCornerToScreen(coord);
        this.context.lineTo(projection.x, projection.y + (useYOffset ? this.yOffset : 0));
    }

    drawTile(tile : Coord, isHovered : boolean, isJumpable : boolean) : void {
        let tileCornerUpRight = new Coord(tile.x+1, tile.y);
        let tileCornerRightDown = new Coord(tile.x+1, tile.y+1);
        let tileCornerDownLeft = new Coord(tile.x, tile.y+1);
        this.context.strokeStyle = isHovered ? this.tileStrokeColorHover : this.tileStrokeColor;
        this.context.fillStyle = isHovered ? (isJumpable !== undefined ? (isJumpable ? this.tileColorJumpable : this.tileColorNotJumpable) : this.tileColorHover) : this.tileColor;
        this.context.beginPath();
        this.moveToTileCorner(tile);
        this.lineToTileCorner(tileCornerUpRight);
        this.lineToTileCorner(tileCornerRightDown);
        this.lineToTileCorner(tileCornerDownLeft);
        this.context.closePath();
        this.context.stroke();
        this.context.fill();
    }

    drawPeg(tile : Coord, isRaised : boolean) : void {
        this.context.save();
        this.context.scale(1, 0.5);

        let centerProjection = this.isometricCalc.tileCornerToScreen(new Coord(tile.x+0.5, tile.y+0.5));

        this.drawPegShadow(tile, centerProjection, isRaised);
        this.drawPegBody(tile, centerProjection, isRaised);

        this.context.restore();
    }

    private drawPegShadow(tile : Coord, centerProjection : Coord, isRaised : boolean) : void {
        this.context.fillStyle = this.pegShadowColor;

        let shadowBottom = isRaised
            ? new Coord(
                this.isometricCalc.tileCornerToScreen(new Coord(
                    tile.x + this.pegRaise / this.tileSize * Math.cos(this.pegShadowRad),
                    tile.y + this.pegRaise / this.tileSize * Math.sin(this.pegShadowRad)
                )).x,
                2 * this.isometricCalc.tileCornerToScreen(new Coord(
                    tile.x + 1 + this.pegRaise / this.tileSize * Math.cos(this.pegShadowRad),
                    tile.y + this.pegRaise / this.tileSize * Math.sin(this.pegShadowRad)
                )).y
            )
            : new Coord(
                centerProjection.x,
                2*centerProjection.y
            );

        let shadowTop = isRaised
            ? new Coord(
                this.isometricCalc.tileCornerToScreen(new Coord(
                    tile.x + (this.pegRaise / this.tileSize + this.pegShadowLength) * Math.cos(this.pegShadowRad),
                    tile.y + (this.pegRaise / this.tileSize + this.pegShadowLength) * Math.sin(this.pegShadowRad)
                )).x,
                2 * this.isometricCalc.tileCornerToScreen(new Coord(
                    tile.x + 1 + (this.pegRaise / this.tileSize + this.pegShadowLength) * Math.cos(this.pegShadowRad),
                    tile.y + (this.pegRaise / this.tileSize + this.pegShadowLength) * Math.sin(this.pegShadowRad)
                )).y
            )
            : new Coord(
                this.isometricCalc.tileCornerToScreen(new Coord(
                    tile.x + this.pegShadowLength * Math.cos(this.pegShadowRad),
                    tile.y + this.pegShadowLength * Math.sin(this.pegShadowRad)
                )).x,
                2 * this.isometricCalc.tileCornerToScreen(new Coord(
                    tile.x + 1 + this.pegShadowLength * Math.cos(this.pegShadowRad),
                    tile.y + this.pegShadowLength * Math.sin(this.pegShadowRad)
                )).y
            );

        let r = Math.sqrt(Math.pow(shadowBottom.x - shadowTop.x, 2) + Math.pow(shadowBottom.y - shadowTop.y, 2));
        let delta = new Coord(
            this.pegWidth / (2 * r) * (shadowTop.y - shadowBottom.y),
            this.pegWidth / (2 * r) * (shadowBottom.x - shadowTop.x)
        );

        this.context.beginPath();
        this.context.arc(shadowBottom.x, shadowBottom.y, this.pegWidth/2, 0, 2*Math.PI);
        this.context.fill();

        this.context.beginPath();
        this.context.arc(shadowTop.x, shadowTop.y, this.pegWidth/2, 0, 2*Math.PI);
        this.context.fill();

        this.context.beginPath();
        this.context.moveTo(shadowTop.x+delta.x, shadowTop.y+delta.y);
        this.context.lineTo(shadowTop.x-delta.x, shadowTop.y-delta.y);
        this.context.lineTo(shadowBottom.x-delta.x, shadowBottom.y-delta.y);
        this.context.lineTo(shadowBottom.x+delta.x, shadowBottom.y+delta.y);
        this.context.closePath()
        this.context.fill();
    }

    private drawPegBody(tile : Coord, centerProjection : Coord, isRaised : boolean) : void {
        let pegRaise = isRaised ? this.pegRaise : 0;

        this.context.fillStyle = this.createPegFillStyle(tile);

        this.context.beginPath();
        this.context.rect(centerProjection.x-this.pegWidth/2, 2*(centerProjection.y-this.pegHeight-pegRaise), this.pegWidth, 2*this.pegHeight);
        this.context.fill();

        this.context.beginPath();
        this.context.arc(centerProjection.x, 2*(centerProjection.y-pegRaise), this.pegWidth/2, 0, 2*Math.PI);
        this.context.fill();

        this.context.fillStyle = 'hsl(0, 70%, '+this.pegLightnessMax+'%)';

        this.context.beginPath();
        this.context.arc(centerProjection.x, 2*(centerProjection.y-this.pegHeight-pegRaise), this.pegWidth/2, 0, 2*Math.PI);
        this.context.fill();
    }

    private createPegFillStyle(tile : Coord) : CanvasGradient {
        let screenProjection = this.isometricCalc.tileCornerToScreen(tile);
        let gradient = this.context.createLinearGradient(screenProjection.x-this.pegWidth/2, 0, screenProjection.x+this.pegWidth/2, 0);
        gradient.addColorStop(0, 'hsl(0, 70%, '+this.sineValue(3*Math.PI/4)+'%)');
        gradient.addColorStop(0.25, 'hsl(0, 70%, '+this.sineValue(4*Math.PI/4)+'%)');
        gradient.addColorStop(0.5, 'hsl(0, 70%, '+this.sineValue(5*Math.PI/4)+'%)');
        gradient.addColorStop(0.75, 'hsl(0, 70%, '+this.sineValue(6*Math.PI/4)+'%)');
        gradient.addColorStop(1, 'hsl(0, 70%, '+this.sineValue(7*Math.PI/4)+'%)');
        return gradient;
    }

    private sineValue(offset : number) : number {
        return Math.sin(this.pegShadowRad+offset) * this.sineAmplitude + this.sineAverage;
    }
}