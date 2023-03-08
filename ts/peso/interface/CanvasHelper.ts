import {Coord} from "../../core/model/Coord";

export interface CanvasHelper {
    moveToTileCorner(coord : Coord) : void
    lineToTileCorner(coord : Coord, useYOffset ?: boolean) : void
    drawTile(tile : Coord, isHovered : boolean, isJumpable : boolean) : void
    drawPeg(tile : Coord, isRaised : boolean) : void
    pegShadowRad : number
}