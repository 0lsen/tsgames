import {BaseApp} from "../core/BaseApp";
import {Coord} from "../core/model/Coord";

export abstract class CanvasApp extends BaseApp {

    private readonly _canvas = $('#canvas')[0] as HTMLCanvasElement;
    private readonly _context = this._canvas.getContext("2d");

    protected readonly _dimensions : Coord;

    constructor() {
        super();
        setTimeout(() => this.init(), 1);
    }

    protected init() : void {
        this._canvas.width = this._dimensions.x;
        this._canvas.height = this._dimensions.y;
    }

    public clear() : void {
        this.context.clearRect(0, 0, this.dimensions.x, this.dimensions.y);
    }

    protected getMouseCoord(e: MouseEvent) : Coord {
        let boundingRect = this._canvas.getBoundingClientRect();
        return new Coord(
            (e.clientX - boundingRect.left)*(this._dimensions.x/boundingRect.width),
            (e.clientY - boundingRect.top)*(this._dimensions.y/boundingRect.height)
        );
    }

    get canvas(): HTMLCanvasElement {
        return this._canvas;
    }

    get context(): CanvasRenderingContext2D {
        return this._context;
    }

    get dimensions(): Coord {
        return this._dimensions;
    }
}