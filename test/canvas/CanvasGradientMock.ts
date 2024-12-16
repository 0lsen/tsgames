export class CanvasGradientMock {

    private _colorStops = new Map<number, string>();

    addColorStop(offset: number, color: string): void {
        this._colorStops.set(offset, color);
    }

    get colorStops(): Map<number, string> {
        return this._colorStops;
    }
}