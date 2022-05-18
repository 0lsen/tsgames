import {CoordDimensionChooser} from "../interface/CoordDimensionChooser";
import {Coord} from "../../core/model/Coord";
import {Direction} from "../../core/enum/Direction";

export class CoordDimensionChooserImpl implements CoordDimensionChooser {

    choose(coord: Coord, gravityDirection: Direction, getVertical: boolean): number {
        let isVertical = [Direction.UP, Direction.DOWN, null].includes(gravityDirection);
        return getVertical ? (isVertical ? coord.y : coord.x) : (isVertical ? coord.x : coord.y);
    }
}