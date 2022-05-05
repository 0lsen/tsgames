
export class Position {
    readonly x : number;
    readonly y : number;

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }

    equals(other : Position) : boolean {
        return other.x === this.x && other.y === this.y;
    }
}