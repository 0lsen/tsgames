import {BaseApp} from "../core/BaseApp";
import {Coord} from "../core/model/Coord";

export class App extends BaseApp {

    private readonly canvas = $('#canvas')[0] as HTMLCanvasElement;
    private readonly context = this.canvas.getContext("2d");

    private readonly boardHeight = 20;
    private readonly boardColor = '#855';
    private readonly tileSize = 100;
    private readonly tileColor = '#eee';
    private readonly tileColorHover = '#ddd';
    private readonly tileColorJumpable = '#ada';
    private readonly tileColorNotJumpable = '#daa';
    private readonly tileStrokeColor = '#ccc';
    private readonly tileStrokeColorHover = '#666';
    private readonly pegWidth = 25;
    private readonly pegHeight = 40;
    private readonly pegRaise = 20;
    private readonly pegColorSide1 = '#f99';
    private readonly pegColorSide2 = '#d33';
    private readonly pegColorTop = '#d66';
    private readonly pegShadowColor = '#aaa';
    private readonly pegShadowLength = 0.3;

    private readonly dimensions : Coord;
    private readonly radChangeMs = 750;

    private map : boolean[][];
    private start : boolean = true;
    private hover : Coord;
    private raised : Coord;
    private pegShadowRad = -1;

    constructor() {
        super();
        this.dimensions = new Coord(2*7*this.tileSize, 2*7*this.tileSize/2);
        this.canvas.width = this.dimensions.x;
        this.canvas.height = this.dimensions.y;
        this.canvas.addEventListener('click', this.clickFunc);
        this.canvas.addEventListener('mousemove', this.mousemoveFunc);
        this.canvas.addEventListener('mouseout', this.mouseoutFunc);
        this.$resetButton.on('click', () => this.reset());
        this.populateMap();
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
        let raisedExists = this.raised !== undefined;
        this.drawTiles(raisedExists);
        this.drawPegs(raisedExists);
    }

    private drawBoard() : void {
        this.context.fillStyle = this.boardColor;
        this.context.beginPath();
        this.context.moveTo(this.mapToScreenX(0, 5), this.mapToScreenY(0, 5));
        this.context.lineTo(this.mapToScreenX(0, 5), this.mapToScreenY(0, 5)+this.boardHeight);
        this.context.lineTo(this.mapToScreenX(2, 5), this.mapToScreenY(2, 5)+this.boardHeight);
        this.context.lineTo(this.mapToScreenX(2, 7), this.mapToScreenY(2, 7));
        this.context.lineTo(this.mapToScreenX(2, 7), this.mapToScreenY(2, 7)+this.boardHeight);
        this.context.lineTo(this.mapToScreenX(5, 7), this.mapToScreenY(5, 7)+this.boardHeight);
        this.context.lineTo(this.mapToScreenX(5, 5), this.mapToScreenY(5, 5)+this.boardHeight);
        this.context.lineTo(this.mapToScreenX(7, 5), this.mapToScreenY(7, 5)+this.boardHeight);
        this.context.lineTo(this.mapToScreenX(7, 2), this.mapToScreenY(7, 2)+this.boardHeight);
        this.context.lineTo(this.mapToScreenX(7, 2), this.mapToScreenY(7, 2));
        this.context.lineTo(this.mapToScreenX(5, 2), this.mapToScreenY(5, 2)+this.boardHeight);
        this.context.lineTo(this.mapToScreenX(5, 0), this.mapToScreenY(5, 0)+this.boardHeight);
        this.context.lineTo(this.mapToScreenX(5, 0), this.mapToScreenY(5, 0));
        this.context.closePath();
        this.context.fill();
    }

    private drawTiles(raisedExists : boolean) : void {
        for (let i = 0; i < 7; i++) {
            for (let j = 0; j < 7; j++) {
                if (!this.isValidTile(i, j)) {
                    continue;
                }
                let isHovered = this.isHovered(i, j);
                let isPopulated = this.map[i][j];
                let isRaised = raisedExists && isPopulated && i == this.raised.x && j == this.raised.y;
                let isJumpable = (raisedExists && !isRaised && isHovered) ? this.isJumpable(i, j) : undefined;

                this.drawTile(i, j, isHovered, isJumpable);
            }
        }
    }

    private drawPegs(raisedExists : boolean) : void {
        for (let i = 0; i < 7; i++) {
            for (let j = 0; j < 7; j++) {
                if (!this.isValidTile(i, j)) {
                    continue;
                }
                let isHovered = this.isHovered(i, j);
                let isPopulated = this.map[i][j];
                let isRaised = raisedExists && isPopulated && i == this.raised.x && j == this.raised.y;

                if (isPopulated) {
                    this.drawPeg(i, j, isRaised);
                }
            }
        }
    }

    private drawTile(i : number, j : number, isHovered : boolean, isJumpable : boolean) : void {
        this.context.strokeStyle = isHovered ? this.tileStrokeColorHover : this.tileStrokeColor;
        this.context.fillStyle = isHovered ? (isJumpable !== undefined ? (isJumpable ? this.tileColorJumpable : this.tileColorNotJumpable) : this.tileColorHover) : this.tileColor;
        this.context.beginPath();
        this.context.moveTo(this.mapToScreenX(i, j), this.mapToScreenY(i, j));
        this.context.lineTo(this.mapToScreenX(i+1, j), this.mapToScreenY(i+1, j));
        this.context.lineTo(this.mapToScreenX(i+1, j+1), this.mapToScreenY(i+1, j+1));
        this.context.lineTo(this.mapToScreenX(i, j+1), this.mapToScreenY(i, j+1));
        this.context.closePath();
        this.context.stroke();
        this.context.fill();
    }

    private drawPeg(i : number, j : number, isRaised : boolean) : void {
        let pegRaise = isRaised ? this.pegRaise : 0;

        this.context.save();
        this.context.scale(1, 0.5);

        this.context.fillStyle = this.pegShadowColor;

        let centerX = this.mapToScreenX(i, j);
        let centerYBase = this.mapToScreenY(i+1, j);

        // shadow
        // TODO: Clipping

        let shadowBottomX = isRaised
            ? this.mapToScreenX(i + this.pegRaise/this.tileSize*Math.cos(this.pegShadowRad), j +  this.pegRaise/this.tileSize*Math.sin(this.pegShadowRad))
            : centerX;
        let shadowBottomY = isRaised
            ? 2*this.mapToScreenY(i+1 + this.pegRaise/this.tileSize*Math.cos(this.pegShadowRad), j +  this.pegRaise/this.tileSize*Math.sin(this.pegShadowRad))
            : 2*centerYBase;
        let shadowTopX = isRaised
            ? this.mapToScreenX(i + (this.pegRaise/this.tileSize + this.pegShadowLength)*Math.cos(this.pegShadowRad), j + (this.pegRaise/this.tileSize + this.pegShadowLength)*Math.sin(this.pegShadowRad))
            : this.mapToScreenX(i + this.pegShadowLength*Math.cos(this.pegShadowRad), j + this.pegShadowLength*Math.sin(this.pegShadowRad));
        let shadowTopY = isRaised
            ? 2*this.mapToScreenY(i+1 + (this.pegRaise/this.tileSize + this.pegShadowLength)*Math.cos(this.pegShadowRad), j + (this.pegRaise/this.tileSize + this.pegShadowLength)*Math.sin(this.pegShadowRad))
            : 2*this.mapToScreenY(i+1 + this.pegShadowLength*Math.cos(this.pegShadowRad), j + this.pegShadowLength*Math.sin(this.pegShadowRad));
        let r = Math.sqrt(Math.pow(shadowBottomX-shadowTopX, 2) + Math.pow(shadowBottomY-shadowTopY, 2));
        let xDelta = this.pegWidth/(2*r)*(shadowTopY-shadowBottomY);
        let yDelta = this.pegWidth/(2*r)*(shadowBottomX-shadowTopX);

        this.context.beginPath();
        this.context.arc(shadowBottomX, shadowBottomY, this.pegWidth/2, 0, 2*Math.PI);
        this.context.fill();

        this.context.beginPath();
        this.context.arc(shadowTopX, shadowTopY, this.pegWidth/2, 0, 2*Math.PI);
        this.context.fill();

        this.context.beginPath();
        this.context.moveTo(shadowTopX+xDelta, shadowTopY+yDelta);
        this.context.lineTo(shadowTopX-xDelta, shadowTopY-yDelta);
        this.context.lineTo(shadowBottomX-xDelta, shadowBottomY-yDelta);
        this.context.lineTo(shadowBottomX+xDelta, shadowBottomY+yDelta);
        this.context.closePath()
        this.context.fill();

        // draw peg
        // TODO: adjust to fillStyle to pegShadowRad

        this.context.fillStyle = this.createFillStyle(i, j);

        this.context.beginPath();
        this.context.rect(centerX-this.pegWidth/2, 2*(centerYBase-this.pegHeight-pegRaise), this.pegWidth, 2*this.pegHeight);
        this.context.fill();

        this.context.beginPath();
        this.context.arc(centerX, 2*(centerYBase-pegRaise), this.pegWidth/2, 0, 2*Math.PI);
        this.context.fill();

        this.context.fillStyle = this.pegColorTop;

        this.context.beginPath();
        this.context.arc(centerX, 2*(centerYBase-this.pegHeight-pegRaise), this.pegWidth/2, 0, 2*Math.PI);
        this.context.fill();

        this.context.restore();
    }

    private isValidTile(i : number, j : number) : boolean {
        return i >= 0 && i <= 6 && j >= 0 && j <= 6 && !((i < 2 || i > 4) && (j < 2 || j > 4));
    }

    private isHovered(i : number, j : number) : boolean {
        return this.hover !== undefined && this.hover.x == i && this.hover.y == j;
    }

    private isJumpable(i : number, j : number) : boolean {
        if (this.map[i][j] === true) {
            return false;
        }
        if (i == this.raised.x) {
            let distance = j - this.raised.y;
            let yBetween = j - distance/2;
            return Math.abs(distance) == 2 && this.map[i][yBetween] === true;
        } else {
            let distance = i - this.raised.x;
            let xBetween = i - distance/2;
            return Math.abs(distance) == 2 && this.map[xBetween][j] === true;
        }
    }

    private mapToScreenX(i : number, j : number) : number {
        return this.dimensions.x/2 + (i-j) * this.tileSize;
    }

    private mapToScreenY(i : number, j : number) : number {
        return (i+j) * (this.tileSize/2);
    }

    private screenToMapI(x : number, y : number) : number {
        return Math.floor((x - this.dimensions.x/2 + 2*y)/(2*this.tileSize));
    }

    private screenToMapJ(x : number, y : number) : number {
        return Math.floor(7+(2*y - x - this.dimensions.x/2)/(2*this.tileSize));
    }

    private createFillStyle(i : number, j : number) : CanvasGradient {
        let gradient = this.context.createLinearGradient(this.mapToScreenX(i, j), 0, this.mapToScreenX(i, j)+this.pegWidth, 0);
        gradient.addColorStop(0, this.pegColorSide1);
        gradient.addColorStop(1, this.pegColorSide2);
        return gradient;
    }

    private clickFunc = (e) => this.click(e);

    private click(e) : void {
        let coord = this.getMapCoord(e);
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
        let boundingRect = this.canvas.getBoundingClientRect();
        let mouseX = (e.clientX - boundingRect.left)*(this.dimensions.x/boundingRect.width);
        let mouseY = (e.clientY - boundingRect.top)*(this.dimensions.y/boundingRect.height);
        let i = this.screenToMapI(mouseX, mouseY);
        let j = this.screenToMapJ(mouseX, mouseY);
        return this.isValidTile(i, j) ? new Coord(i, j) : undefined;
    }

    private attemptToPutDown(jumpCoord : Coord) : void {
        if (jumpCoord.x == this.raised.x && jumpCoord.y == this.raised.y) {
            this.raised = undefined;
        }
    }

    private attemptToJump(jumpCoord : Coord) : void {
        if ((jumpCoord.x != this.raised.x && jumpCoord.y != this.raised.y) || !this.isJumpable(jumpCoord.x, jumpCoord.y)) {
            return;
        }
        if (jumpCoord.x == this.raised.x) {
            let distance = jumpCoord.y - this.raised.y;
            let yBetween = jumpCoord.y - distance/2;
            this.map[jumpCoord.x][jumpCoord.y] = true;
            this.map[jumpCoord.x][yBetween] = false;
            this.map[this.raised.x][this.raised.y] = false;
            this.raised = undefined;
        } else {
            let distance = jumpCoord.x - this.raised.x;
            let xBetween = jumpCoord.x - distance/2;
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
        window.requestAnimationFrame(() => this.animate());
    }

    private time() : void {
        this.pegShadowRad = (this.pegShadowRad+0.01)%(2*Math.PI);
        window.requestAnimationFrame(() => this.animate());
        setTimeout(() => this.time(), this.radChangeMs);
    }
}