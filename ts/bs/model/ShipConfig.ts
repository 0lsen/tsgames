export class ShipConfig {
    private _clazz: string;
    private _count: number;

    constructor(clazz: string, count: number) {
        this._clazz = clazz;
        this._count = count;
    }

    get clazz(): string {
        return this._clazz;
    }

    get count(): number {
        return this._count;
    }
}