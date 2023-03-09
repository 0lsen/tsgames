import {BaseApp} from "../core/BaseApp";
import {Coord} from "../core/model/Coord";

export abstract class CanvasApp extends BaseApp {

    protected readonly canvas = $('#canvas')[0] as HTMLCanvasElement;
    protected readonly context = this.canvas.getContext("2d");

    protected readonly dimensions : Coord;

    constructor() {
        super();
        setTimeout(() => this.init(), 1);
    }

    protected init() : void {
        this.canvas.width = this.dimensions.x;
        this.canvas.height = this.dimensions.y;
    }

    protected getMouseCoord(e: MouseEvent) : Coord {
        let boundingRect = this.canvas.getBoundingClientRect();
        return new Coord(
            (e.clientX - boundingRect.left)*(this.dimensions.x/boundingRect.width),
            (e.clientY - boundingRect.top)*(this.dimensions.y/boundingRect.height)
        );
    }
}