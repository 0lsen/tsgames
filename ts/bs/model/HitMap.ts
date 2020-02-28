import {BoardMap} from "./BoardMap";

export class HitMap extends BoardMap {

    private _hit: boolean[] = [];

    public alreadyHit(x: number, y: number): boolean {
        return this.exists(x, y);
    }

    public placeHit(x: number, y: number, hit: boolean): void {
        this.coordX.push(x);
        this.coordY.push(y);
        this._hit.push(hit);
    }


    get hit(): boolean[] {
        return this._hit;
    }
}