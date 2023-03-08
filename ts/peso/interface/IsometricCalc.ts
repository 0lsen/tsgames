import {Coord} from "../../core/model/Coord";

export interface IsometricCalc {
    tileCornerToScreen(tile : Coord) : Coord
    screenToTile(screen : Coord) : Coord
}