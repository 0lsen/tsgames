import {ThisShouldNeverHappenException} from "../../core/exception/ThisShouldNeverHappenException";

export abstract class BoardMap {
    private _coordX: number[] = [];
    private _coordY: number[] = [];

    public findIndex(x: number, y:number): number {
        let matchesX = this.findIndices(this._coordX, x);
        let matchesY = this.findIndices(this._coordY, y);
        let match = matchesX.filter(value => matchesY.indexOf(value) > -1);

        if (match.length != 1) throw new ThisShouldNeverHappenException();

        return match[0];
    }

    protected exists(x: number, y:number): boolean {
        let matchesX = this.findIndices(this._coordX, x);
        let matchesY = this.findIndices(this._coordY, y);

        return matchesX.filter(value => matchesY.indexOf(value) > -1).length > 0;
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


    get coordX(): number[] {
        return this._coordX;
    }

    get coordY(): number[] {
        return this._coordY;
    }
}