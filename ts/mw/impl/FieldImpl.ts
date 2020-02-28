import {Field} from "../interface/Field";
import {Settings} from "../Settings";
import {OutOfBoundsException} from "../../core/exception/OutOfBoundsException";
import {Randomizer} from "../../core/interface/Randomizer";

export class FieldImpl implements Field {

    private randomizer: Randomizer;
    private settings: Settings;

    private minesX: number[];
    private minesY: number[];

    private freeX: number[];
    private freeY: number[];
    private freeN: number[];

    private revealed: number[];

    constructor(randomizer: Randomizer, settings: Settings, initX: number, initY: number) {
        this.randomizer = randomizer;
        this.settings = settings;

        if (initX-1 > this.settings.WIDTH || initY-1 > this.settings.HEIGHT) {
            throw new OutOfBoundsException();
        }

        this.minesX = [];
        this.minesY = [];
        this.freeX = [];
        this.freeY = [];
        this.freeN = [];
        this.revealed = [];

        this.setMines(initX, initY);
        this.buildFreeSpace();
        this.click(initX, initY);
    }

    click(x: number, y: number, check: boolean = false): void {
        if (!check || (!this.isDefeated() && !this.isComplete())) {
            let matches = this.matches(x, this.freeX, y, this.freeY);
            if (matches.length && this.revealed.indexOf(matches[0]) == -1) {
                this.revealed.push(matches[0]);
                if (this.freeN[matches[0]] === 0) {
                    if (x > 0) {
                        this.click(x-1, y);
                        if (y > 0) this.click(x-1, y-1);
                        if (y < this.settings.HEIGHT-1) this.click(x-1, y+1);
                    }
                    if (x < this.settings.WIDTH-1) {
                        this.click(x+1, y);
                        if (y > 0) this.click(x+1, y-1);
                        if (y < this.settings.HEIGHT-1) this.click(x+1, y+1);
                    }
                    if (y > 0) this.click(x, y-1);
                    if (y < this.settings.HEIGHT-1) this.click(x, y+1);
                }
                if (this.freeN[matches[0]] === null) {
                    this.revealMines();
                }
            }
        }
    }

    isDefeated(): boolean {
        return this.view().indexOf(null) != -1;
    }

    isComplete(): boolean {
        return !this.isDefeated() && this.revealed.length == this.settings.HEIGHT*this.settings.WIDTH-this.settings.MINES;
    }

    view(): number[] {
        let list = [];
        for (let i=0; i < this.settings.WIDTH * this.settings.HEIGHT; i++) {
            list.push(this.revealed.indexOf(i) == -1 ? -1 : this.freeN[i]);
        }
        return list;
    }

    private setMines(initX: number, initY: number): void {
        for (let i=0; i < this.settings.MINES; i++) {
            let x;
            let y;
            do {
                x = this.randomizer.randomInt(this.settings.WIDTH);
                y = this.randomizer.randomInt(this.settings.HEIGHT);
            } while (!this.isValid(x, y, initX, initY));
            this.minesX.push(x);
            this.minesY.push(y);
        }
    }

    private isValid(x: number, y: number, initX: number, initY: number): boolean {
        if (x === initX && y === initY) return false;
        return this.isFree(x, y);
    }

    private isFree(x: number, y:number): boolean {
        return this.matches(x, this.minesX, y, this.minesY).length == 0;
    }

    private matches(x: number, listX: number[], y: number, listY: number[]): number[] {
        let matchesX = this.findIndices(listX, x);
        let matchesY = this.findIndices(listY, y);
        return matchesX.filter(value => matchesY.indexOf(value) > -1);
    }

    private findIndices(list: number[], value:number): number[] {
        let matches = [];
        for (let i = 0; i < list.length; i++) {
            if (list[i] === value) {
                matches.push(i);
            }
        }
        return matches;
    }

    private buildFreeSpace(): void {
        for (let y=0; y < this.settings.HEIGHT; y++) {
            for (let x=0; x < this.settings.WIDTH; x++) {
                this.freeX.push(x);
                this.freeY.push(y);
                this.freeN.push(this.isFree(x, y) ? this.mineNeighbours(x, y) : null);
            }
        }
    }

    private mineNeighbours(x: number, y: number): number {
        let count = 0;
        if (x > 0) {
            if (!this.isFree(x-1, y)) count++;
            if (y > 0 && !this.isFree(x-1, y-1)) count++;
            if (y < this.settings.HEIGHT-1 && !this.isFree(x-1, y+1)) count++;
        }
        if (x < this.settings.WIDTH-1) {
            if (!this.isFree(x+1, y)) count++;
            if (y > 0 && !this.isFree(x+1, y-1)) count++;
            if (y < this.settings.HEIGHT-1 && !this.isFree(x+1, y+1)) count++;
        }
        if (y > 0 && !this.isFree(x, y-1)) count++;
        if (y < this.settings.HEIGHT-1 && !this.isFree(x, y+1)) count++;
        return count;
    }

    private revealMines() {
        for (let i = 0; i < this.minesX.length; i++) {
            let index = this.minesY[i]*this.settings.WIDTH+this.minesX[i];
            if (this.revealed.indexOf(index) == -1) {
                this.revealed.push(index);
            }
        }
    }

    public toString() {
        console.log("MINES");
        let string = '';
        for (let y=0; y < this.settings.HEIGHT; y++) {
            for (let x=0; x < this.settings.WIDTH; x++) {
                string += " "+ (this.matches(x, this.minesX, y, this.minesY).length == 0 ? " " : "X")+" ";
            }
            string +="\n";
        }
        console.log(string);
        string = "";
        console.log("NUMBERS");
        for (let y=0; y < this.settings.HEIGHT; y++) {
            for (let x=0; x < this.settings.WIDTH; x++) {
                let neighbours = this.freeN[y*this.settings.WIDTH + x];
                string += " "+(neighbours === null ? " " : neighbours)+" ";
            }
            string +="\n";
        }
        console.log(string);
    }
}