import {Coord} from "../../core/model/Coord";
import {Direction} from "../../core/enum/Direction";

export interface CoordDimensionChooser {
    choose(coord : Coord, gravityDirection : Direction, getVertical) : number;
}