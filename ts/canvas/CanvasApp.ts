import {BaseApp} from "../core/BaseApp";
import {Coord} from "../core/model/Coord";
import {CanvasContext} from "./CanvasContext";
import {CanvasContextImpl} from "./CanvasContextImpl";

export abstract class CanvasApp extends BaseApp {

    private readonly _canvas = $('#canvas')[0] as HTMLCanvasElement;
    private readonly _context = new CanvasContextImpl(this._canvas.getContext("2d"));

    protected readonly _dimensions : Coord;
    private _center : Coord;
    protected readonly fps : number = 60;

    private lastRecursiveAnimationFrameTime : number = 0;
    private recursiveAnimationFrameRequested = false;

    constructor() {
        super();
        setTimeout(() => this.init(), 1);
    }

    protected init() : void {
        this._canvas.width = this._dimensions.x;
        this._canvas.height = this._dimensions.y;
        this._center = new Coord(this._dimensions.x/2, this._dimensions.y/2);
    }

    public clear() : void {
        this.context.clearRect(0, 0, this.dimensions.x, this.dimensions.y);
    }

    protected getMouseCoord(e: MouseEvent) : Coord {
        const boundingRect = this._canvas.getBoundingClientRect();
        return new Coord(
            (e.clientX - boundingRect.left)*(this._dimensions.x/boundingRect.width),
            (e.clientY - boundingRect.top)*(this._dimensions.y/boundingRect.height)
        );
    }

    protected getTime() : number {
        return new Date().getTime();
    }

    protected requestRecursiveAnimationFrame(animationCallback : () => void, recursive = false) : void {
        if (this.recursiveAnimationFrameRequested && !recursive) {
            debugger;
            console.log('multiple recursive animations requested. please dont!');
            return;
        }
        this.recursiveAnimationFrameRequested = true;
        const time = this.getTime();
        const diff = time - this.lastRecursiveAnimationFrameTime;
        if (diff >= 1000/this.fps) {
            this.recursiveAnimationFrameRequested = false;
            this.lastRecursiveAnimationFrameTime = time;
            window.requestAnimationFrame(animationCallback);
        } else {
            setTimeout(() => this.requestRecursiveAnimationFrame(animationCallback, true), 1000/this.fps-Math.ceil(diff));
        }
    }

    get canvas(): HTMLCanvasElement {
        return this._canvas;
    }

    get context(): CanvasContext {
        return this._context;
    }

    get dimensions(): Coord {
        return this._dimensions;
    }

    get center(): Coord {
        return this._center;
    }
}