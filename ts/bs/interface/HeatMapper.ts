import {HeatMap} from "../model/HeatMap";
import {HitMap} from "../model/HitMap";

export interface HeatMapper {
    build(hitmap: HitMap, minLength: number, maxLength: number): HeatMap
}