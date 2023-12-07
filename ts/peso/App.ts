import {Coord} from "../core/model/Coord";
import {IsometricCalc} from "./interface/IsometricCalc";
import {CanvasHelper} from "./interface/CanvasHelper";
import {IsometricCalcImpl} from "./impl/IsometricCalcImpl";
import {CanvasHelperImpl} from "./impl/CanvasHelperImpl";
import {CanvasApp} from "../canvas/CanvasApp";

export class App extends CanvasApp {

    private readonly isometricCalc : IsometricCalc;
    private readonly canvasHelper : CanvasHelper;

    private readonly boardColor = '#855';
    private readonly tileSize = 100;
    private readonly lightRotationMsMin = 5;
    private readonly lightRotationMsMax = 30;

    protected readonly _dimensions = new Coord(2*7*this.tileSize, 7*this.tileSize);
    private readonly radChangeMs = 750;
    private map : boolean[][];
    private start : boolean = true;
    private hover : Coord;
    private raised : Coord;
    private rotation : number;

    constructor() {
        super();
        this.isometricCalc = new IsometricCalcImpl(this.dimensions, this.tileSize);
        this.canvasHelper = new CanvasHelperImpl(this.isometricCalc, this.context, this.tileSize);
        this.canvas.addEventListener('click', this.clickFunc);
        this.canvas.addEventListener('mousemove', this.mousemoveFunc);
        this.canvas.addEventListener('mouseout', this.mouseoutFunc);
        this.$resetButton.on('click', () => this.reset());
        this.populateMap();
    }

    protected init() {
        super.init();
        this.animate();
        this.time();
    }

    private populateMap() : void {
        this.map = [];
        for (let i = 0; i < 7; i++) {
            this.map.push([]);
            for (let j = 0; j < 7; j++) {
                this.map[i].push((i < 2 || i > 4) && (j < 2 || j > 4) ? undefined : true);
            }
        }
    }

    private animate() : void {
        this.context.clearRect(0, 0, this.dimensions.x, this.dimensions.y);
        this.drawBoard();
        const raisedExists = this.raised !== undefined;
        this.drawTiles(raisedExists);
        this.drawPegs(raisedExists);
    }

    private drawBoard() : void {
        this.context.fillStyle = this.boardColor;
        this.context.beginPath();
        this.canvasHelper.moveToTileCorner(new Coord(0, 5));
        this.canvasHelper.lineToTileCorner(new Coord(0, 5), true);
        this.canvasHelper.lineToTileCorner(new Coord(2, 5), true);
        this.canvasHelper.lineToTileCorner(new Coord(2, 7));
        this.canvasHelper.lineToTileCorner(new Coord(2, 7), true);
        this.canvasHelper.lineToTileCorner(new Coord(5, 7), true);
        this.canvasHelper.lineToTileCorner(new Coord(5, 5), true);
        this.canvasHelper.lineToTileCorner(new Coord(7, 5), true);
        this.canvasHelper.lineToTileCorner(new Coord(7, 2), true);
        this.canvasHelper.lineToTileCorner(new Coord(7, 2));
        this.canvasHelper.lineToTileCorner(new Coord(5, 2), true);
        this.canvasHelper.lineToTileCorner(new Coord(5, 0), true);
        this.canvasHelper.lineToTileCorner(new Coord(5, 0));
        this.context.closePath();
        this.context.fill();
    }

    private drawTiles(raisedExists : boolean) : void {
        for (let i = 0; i < 7; i++) {
            for (let j = 0; j < 7; j++) {
                const tile = new Coord(i, j);
                if (!this.isValidTile(tile)) {
                    continue;
                }
                const isHovered = this.isHovered(tile);
                const isPopulated = this.map[i][j];
                const isRaised = raisedExists && isPopulated && tile.equals(this.raised);
                const isJumpable = (raisedExists && !isRaised && isHovered) ? this.isJumpable(tile) : undefined;

                this.canvasHelper.drawTile(tile, isHovered, isJumpable);
            }
        }
    }

    private drawPegs(raisedExists : boolean) : void {
        for (let i = 0; i < 7; i++) {
            for (let j = 0; j < 7; j++) {
                const tile = new Coord(i, j);
                if (!this.isValidTile(tile)) {
                    continue;
                }
                const isPopulated = this.map[i][j];
                const isRaised = raisedExists && isPopulated && tile.equals(this.raised);

                if (isPopulated) {
                    this.canvasHelper.drawPeg(tile, isRaised);
                }
            }
        }
    }

    private isValidTile(tile : Coord) : boolean {
        return tile.x >= 0 && tile.x <= 6 && tile.y >= 0 && tile.y <= 6 && !((tile.x < 2 || tile.x > 4) && (tile.y < 2 || tile.y > 4));
    }

    private isHovered(tile : Coord) : boolean {
        return this.hover !== undefined && this.hover.x == tile.x && this.hover.y == tile.y;
    }

    private isJumpable(tile : Coord) : boolean {
        if (this.map[tile.x][tile.y] === true) {
            return false;
        }
        if (tile.x == this.raised.x) {
            const distance = tile.y - this.raised.y;
            const yBetween = tile.y - distance/2;
            return Math.abs(distance) == 2 && this.map[tile.x][yBetween] === true;
        } else {
            const distance = tile.x - this.raised.x;
            const xBetween = tile.x - distance/2;
            return Math.abs(distance) == 2 && this.map[xBetween][tile.y] === true;
        }
    }

    private clickFunc = (e) => this.click(e);

    private click(e) : void {
        const coord = this.getMapCoord(e);
        if (coord !== undefined) {
            if (this.start) {
                this.map[coord.x][coord.y] = false;
                this.start = false;
            } else if (this.raised !== undefined) {
                this.attemptToPutDown(coord);
                this.attemptToJump(coord);
            } else if (this.map[coord.x][coord.y] === true) {
                this.raised = coord;
            }
        }
        window.requestAnimationFrame(() => this.animate());
    }

    private mousemoveFunc = (e) => this.mousemove(e);

    private mousemove(e) : void {
        this.hover = this.getMapCoord(e);
        window.requestAnimationFrame(() => this.animate());
    }

    private mouseoutFunc = () => {
        this.hover = undefined;
        window.requestAnimationFrame(() => this.animate());
    }

    private getMapCoord(e) : Coord {
        const boundingRect = this.canvas.getBoundingClientRect();
        const mouseX = (e.clientX - boundingRect.left)*(this.dimensions.x/boundingRect.width);
        const mouseY = (e.clientY - boundingRect.top)*(this.dimensions.y/boundingRect.height);
        const coord = this.isometricCalc.screenToTile(new Coord(mouseX, mouseY));
        return this.isValidTile(coord) ? coord : undefined;
    }

    private attemptToPutDown(jumpCoord : Coord) : void {
        if (jumpCoord.x == this.raised.x && jumpCoord.y == this.raised.y) {
            this.raised = undefined;
        }
    }

    private attemptToJump(jumpCoord : Coord) : void {
        if (this.raised === undefined || (jumpCoord.x != this.raised.x && jumpCoord.y != this.raised.y) || !this.isJumpable(jumpCoord)) {
            return;
        }
        if (jumpCoord.x == this.raised.x) {
            const distance = jumpCoord.y - this.raised.y;
            const yBetween = jumpCoord.y - distance/2;
            this.map[jumpCoord.x][jumpCoord.y] = true;
            this.map[jumpCoord.x][yBetween] = false;
            this.map[this.raised.x][this.raised.y] = false;
            this.raised = undefined;
        } else {
            const distance = jumpCoord.x - this.raised.x;
            const xBetween = jumpCoord.x - distance/2;
            this.map[jumpCoord.x][jumpCoord.y] = true;
            this.map[xBetween][jumpCoord.y] = false;
            this.map[this.raised.x][this.raised.y] = false;
            this.raised = undefined;
        }
    }

    private reset() : void {
        this.populateMap();
        this.start = true;
        this.raised = undefined;
        if (this.rotation === undefined) {
            this.rotation = 0;
            this.rotateLight();
        }
        window.requestAnimationFrame(() => this.animate());
    }

    private rotateLight() : void {
        if (this.rotation !== undefined && this.rotation < Math.PI*2) {
            this.canvasHelper.pegShadowRad = (this.canvasHelper.pegShadowRad + 0.05) % (2 * Math.PI);
            this.rotation += 0.05;
            window.requestAnimationFrame(() => this.animate());
            setTimeout(() => this.rotateLight(), this.rotationTime());
        } else {
            this.rotation = undefined;
        }
    }

    private rotationTime() : number {
        return ((this.lightRotationMsMax-this.lightRotationMsMin)/(Math.PI*Math.PI))*Math.pow(this.rotation-Math.PI, 2) + this.lightRotationMsMin;
    }

    private time() : void {
        if (this.rotation === undefined) {
            this.canvasHelper.pegShadowRad = (this.canvasHelper.pegShadowRad + 0.01) % (2 * Math.PI);
            window.requestAnimationFrame(() => this.animate());
        }
        setTimeout(() => this.time(), this.radChangeMs);
    }
}