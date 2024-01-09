export class Pillar {

    private readonly _height : number;

    constructor(height: number) {
        this._height = height;
    }

    get height(): number {
        return this._height;
    }
}