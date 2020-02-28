import {BoardMap} from "./BoardMap";

export class HeatMap extends BoardMap {

    private heat: number[] = [];

    public applyHeat(x: number, y: number, amount: number): void {
        let index = this.findOrCreate(x, y);
        this.heat[index] += amount*amount;
    }

    public getHeat(): number[] {
        return this.heat;
    }

    private findOrCreate(x: number, y:number): number {
        if (!this.exists(x, y)) {
            this.coordX.push(x);
            this.coordY.push(y);
            this.heat.push(0);
        }
        return this.findIndex(x, y);
    }
}