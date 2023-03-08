import {IsometricCalc} from "../interface/IsometricCalc";
import {Coord} from "../../core/model/Coord";

export class IsometricCalcImpl implements IsometricCalc {

    private readonly dimensions : Coord;
    private readonly tileSize : number;

    constructor(dimensions: Coord, tileSize: number) {
        this.dimensions = dimensions;
        this.tileSize = tileSize;
    }

    tileCornerToScreen(tile: Coord): Coord {
        return new Coord(
            this.dimensions.x/2 + (tile.x-tile.y) * this.tileSize,
            (tile.x+tile.y) * (this.tileSize/2)
        );
    }

    screenToTile(screen: Coord): Coord {
        return new Coord(
            Math.floor((screen.x - this.dimensions.x/2 + 2*screen.y)/(2*this.tileSize)),
            Math.floor(7+(2*screen.y - screen.x - this.dimensions.x/2)/(2*this.tileSize))
        );
    }
}