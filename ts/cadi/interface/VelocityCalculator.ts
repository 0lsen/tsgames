import {Coord} from "../../core/model/Coord";

export interface VelocityCalculator {
    calc(coords : Coord[]) : Coord;
}