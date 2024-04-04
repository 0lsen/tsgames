import {CanvasApp} from "../canvas/CanvasApp";
import {Coord} from "../core/model/Coord";
import {Coord3d} from "./model/Coord3d";
import {Cube} from "./model/Cube";
import {SuperCube} from "./model/SuperCube";
import {booleanUndefined} from "../core/types";
import {CanvasTools} from "../canvas/CanvasTools";
import {ThisShouldNeverHappenException} from "../core/exception/ThisShouldNeverHappenException";
import {ColorSettings} from "./model/ColorSettings";

export class App extends CanvasApp {

    private readonly subCubeMargin = 0.1;

    protected readonly _dimensions = new Coord(500, 500);

    private readonly colorSettings = new ColorSettings();

    private readonly cube = new SuperCube(this.subCubeMargin);

    private readonly coordsConnections = [
        [1, 2, 4],
        [3, 5],
        [3, 6],
        [7],
        [5, 6],
        [7],
        [7],
        []
    ];

    private readonly surfaces = [
        [0, 1, 3, 2],
        [0, 1, 5, 4],
        [0, 2, 6, 4],
        [1, 3, 7, 5],
        [2, 3, 7, 6],
        [4, 5, 7, 6],
    ];

    private readonly winCombos : number[][] = [];

    private readonly rotationMaxSpeed = 0.03;
    private rotation = false;
    private rotationSpeedX = 0;
    private rotationSpeedY = 0;
    private rotationX : number = -1.3;
    private rotationY : number = 1.1;

    private state : booleanUndefined[];
    private playerTurn = true;
    private playerWin : boolean;
    private winCombo : number[];

    private hiddenCorner : number;
    private hoveredCube : number;

    private requestingAnimation : boolean = false;

    protected init() {
        super.init();
        this.buildWinCombos();
        this.setHiddenCorner();
        this.reset();

        this.canvas.tabIndex = 1000;
        this.canvas.addEventListener('mousemove', e => this.onMouseMove(e));
        this.canvas.addEventListener('click', e => this.onMouseClick());
        this.canvas.addEventListener('mousedown', e => this.onMouseDown(e));
        this.canvas.addEventListener('mouseup', e => this.onMouseUp());
        this.$resetButton.on('click', () => this.reset());
    }

    private reset() : void {
        this.state = Array(27).fill(undefined);
        this.playerWin = undefined;
        this.requestAnimation();
    }

    private buildWinCombos() : void {
        for (let i = 0; i < 9; i++) {
            // straight axis 1
            this.winCombos.push([i*3, i*3+1, i*3+2]);
        }
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                // straight axis 2
                this.winCombos.push([i*9+j, i*9+j+3, i*9+j+6]);
                // straight axis 3
                this.winCombos.push([i*3+j, i*3+j+9, i*3+j+18]);
            }
            // diagonals axis 1
            this.winCombos.push([i*9, i*9+4, i*9+8]);
            this.winCombos.push([i*9+2, i*9+4, i*9+6]);
            // diagonals axis 2
            this.winCombos.push([i, i+12, i+24]);
            this.winCombos.push([i+6, i+12, i+18]);
            // diagonals axis 3
            this.winCombos.push([i*3, i*3+10, i*3+20]);
            this.winCombos.push([i*3+2, i*3+10, i*3+18]);
        }
        // diagonals through middle
        this.winCombos.push([0, 13, 26]);
        this.winCombos.push([2, 13, 24]);
        this.winCombos.push([6, 13, 20]);
        this.winCombos.push([8, 13, 18]);
    }

    private setHiddenCorner() : void {
        const corners = this.cube.getCorners();
        this.hiddenCorner = corners.indexOf(corners.reduce((corner1, corner2) => this.projectZ(corner1) < this.projectZ(corner2) ? corner1 : corner2));
    }

    private requestAnimation() : void {
        if (this.requestingAnimation) return;
        this.requestingAnimation = true;
        this.requestRecursiveAnimationFrame(() => {
            this.draw();
            this.requestingAnimation = false;
            if (this.rotation) {
                this.requestAnimation();
            }
        });
    }

    private draw() : void {
        this.checkRotation();
        this.clear();
        [...this.cube.cubes]
            .sort((c1, c2) => this.projectZ(c1.center) - this.projectZ(c2.center))
            .forEach((cube) => this.drawCube(cube, this.cube.cubes.indexOf(cube)));
    }

    private checkRotation() : void {
        if (this.rotation) {
            this.rotationX = (this.rotationX+this.rotationMaxSpeed*this.rotationSpeedX/(this.dimensions.x/2))%(Math.PI*2);
            this.rotationY = (this.rotationY-this.rotationMaxSpeed*this.rotationSpeedY/(this.dimensions.y/2))%(Math.PI*2);
            this.setHiddenCorner();
        }
    }

    private drawCube(cube : Cube, index : number = undefined) : void {
        const corners = cube.getCorners();

        let hue = this.colorSettings.neutralHue;
        let saturation = this.colorSettings.neutralSat;
        let lightness = this.colorSettings.neutralLig;
        let alpha = this.colorSettings.neutralAlp;
        if (this.isCubeSet(index)) {
            hue = this.state[index] ? this.colorSettings.player1Hue : this.colorSettings.player2Hue;
            saturation = this.colorSettings.hoverSat;
            lightness = this.colorSettings.hoverLig;
            if (this.isCubePartOfWinCombo(index)) {
                saturation = this.colorSettings.highlightSat;
                lightness = this.colorSettings.highlightLig;
                alpha = this.colorSettings.highlightAlp;
            }
        }
        if (this.isCubeHovered(index)) {
            hue = this.playerTurn ? this.colorSettings.player1Hue : this.colorSettings.player2Hue;
            saturation = this.colorSettings.highlightSat;
            lightness = this.colorSettings.highlightLig;
            alpha = this.colorSettings.highlightAlp;
        }

        this.surfaces.forEach(surface => {
            if (surface.includes(this.hiddenCorner)) {
                return;
            }
            this.context.fillStyle = 'hsla('+hue+', '+saturation+'%, '+lightness+'%, '+alpha+'%)';
            this.context.beginPath();
            surface.forEach((corner, i) => {
                i
                    ? this.context.lineTo(this.projectX(corners[corner]), this.projectY(corners[corner]))
                    : this.context.moveTo(this.projectX(corners[corner]), this.projectY(corners[corner]))
            });
            this.context.fill();
            this.context.closePath();
        });

        this.context.lineWidth = 1;
        this.coordsConnections.forEach((connections, i) => {
            connections.forEach(j => {
                if (i == this.hiddenCorner || j == this.hiddenCorner) {
                    return;
                }
                this.context.strokeStyle = 'hsla('+hue+', '+(saturation/2)+'%, '+(lightness/2)+'%, '+alpha+'%)';
                this.context.beginPath();
                this.context.moveTo(this.projectX(corners[i]), this.projectY(corners[i]));
                this.context.lineTo(this.projectX(corners[j]), this.projectY(corners[j]));
                this.context.stroke();
                this.context.closePath();
            });
        });
    }

    private isCubeSet(index : number) : boolean {
        return index !== undefined && this.state[index] !== undefined;
    }

    private isCubePartOfWinCombo(index : number) : boolean {
        return this.playerWin !== undefined && this.winCombo.includes(index);
    }

    private isCubeHovered(index : number) : boolean {
        return this.playerWin === undefined && index !== undefined && index === this.hoveredCube && this.state[index] === undefined;
    }

    private onMouseMove(e : MouseEvent) : void {
        const mouseCoord = this.getMouseCoord(e);
        if (this.rotation) {
            if (!this.isMouseOverCube(mouseCoord, this.cube)) {
                this.calcRotation(mouseCoord);
            }
        } else {
            const cube = this.playerWin === undefined && this.isMouseOverCube(mouseCoord, this.cube)
                ? [...this.cube.cubes]
                    .sort((c1, c2) => this.projectZ(c2.center) - this.projectZ(c1.center))
                    .sort((c1, c2) => CanvasTools.distance(mouseCoord, this.projectXY(c1)) - CanvasTools.distance(mouseCoord, this.projectXY(c2)))
                    [0]
                : undefined;
            this.hoveredCube = cube ? this.cube.cubes.indexOf(cube) : undefined;
        }
        this.requestAnimation();
    }

    private onMouseClick() : void {
        if (this.hoveredCube !== undefined && this.state[this.hoveredCube] === undefined) {
            this.state[this.hoveredCube] = this.playerTurn;
            const winCombo = this.winCombos.find(c => this.checkStateIndices(c));
            if (winCombo !== undefined) {
                this.winCombo = winCombo;
                this.playerWin = this.playerTurn;
            } else {
                this.playerTurn = !this.playerTurn;
            }
            this.requestAnimation();
        }
    }

    private onMouseDown(e : MouseEvent) : void {
        const mouseCoord = this.getMouseCoord(e);
        if (!this.isMouseOverCube(mouseCoord, this.cube)) {
            this.rotation = true;
            this.calcRotation(mouseCoord);
            this.requestAnimation();
        }
    }

    private onMouseUp() : void {
        this.rotation = false;
    }

    private calcRotation(mouse : Coord) : void {
        this.rotationSpeedX = mouse.y - this.dimensions.y/2;
        this.rotationSpeedY = this.dimensions.x/2 - mouse.x;
    }

    private isMouseOverCube(mouseCoord : Coord, cube : Cube) : boolean {
        const corners = cube.getCorners();
        for (const surface of this.surfaces) {
            if (surface.includes(this.hiddenCorner)) {
                continue;
            }
            if (this.isMouseInSurfaceArea(
                new Coord(this.projectX(corners[surface[0]]), this.projectY(corners[surface[0]])),
                new Coord(this.projectX(corners[surface[1]]), this.projectY(corners[surface[1]])),
                new Coord(this.projectX(corners[surface[2]]), this.projectY(corners[surface[2]])),
                new Coord(this.projectX(corners[surface[3]]), this.projectY(corners[surface[3]])),
                mouseCoord
            )) {
                return true;
            }
        }
        return false;
    }

    // https://math.stackexchange.com/questions/4183023
    private isMouseInSurfaceArea(corner1 : Coord, corner2 : Coord, corner3 : Coord, corner4: Coord, mouse : Coord) : boolean {
        return new Set([
            (corner2.x-corner1.x)*(mouse.y-corner1.y) - (corner2.y-corner1.y)*(mouse.x-corner1.x),
            (corner3.x-corner2.x)*(mouse.y-corner2.y) - (corner3.y-corner2.y)*(mouse.x-corner2.x),
            (corner4.x-corner3.x)*(mouse.y-corner3.y) - (corner4.y-corner3.y)*(mouse.x-corner3.x),
            (corner1.x-corner4.x)*(mouse.y-corner4.y) - (corner1.y-corner4.y)*(mouse.x-corner4.x)
        ].map(Math.sign)).size === 1;
    }

    private checkStateIndices(indices : number[]) : boolean {
        if (!indices || indices.length != 3) throw new ThisShouldNeverHappenException();
        return this.state[indices[0]] === this.playerTurn && this.state[indices[1]] === this.playerTurn && this.state[indices[2]] === this.playerTurn;
    }

    private projectX(coord : Coord3d) : number {
        return (coord.x * Math.cos(this.rotationY) + coord.y * Math.sin(this.rotationY))
            * this.dimensions.x/4 + this.dimensions.x/2;
    }

    private projectY(coord : Coord3d) : number {
        return (coord.z * Math.sin(this.rotationX) + Math.cos(this.rotationX) * (coord.y * Math.cos(this.rotationY) - coord.x * Math.sin(this.rotationY)))
            * this.dimensions.y/4 + this.dimensions.y/2;
    }

    private projectZ(coord : Coord3d) : number {
        return coord.z * Math.cos(this.rotationX) - Math.sin(this.rotationX) * (coord.y * Math.cos(this.rotationY) - coord.x * Math.sin(this.rotationY));
    }

    private projectXY(cube : Cube) : Coord {
        return new Coord(this.projectX(cube.center), this.projectY(cube.center));
    }
}