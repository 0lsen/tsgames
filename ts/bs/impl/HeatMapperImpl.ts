import {HeatMapper} from "../interface/HeatMapper";
import {HitMap} from "../model/HitMap";
import {HeatMap} from "../model/HeatMap";
import {SpaceCalculator} from "../interface/SpaceCalculator";
import {Settings} from "../Settings";
import {Orientation} from "../../core/enum/Orientation";

export class HeatMapperImpl implements HeatMapper {

    private readonly spaceCalculator: SpaceCalculator;

    constructor(spaceCalculator: SpaceCalculator) {
        this.spaceCalculator = spaceCalculator;
    }

    build(hitmap: HitMap, minLength: number, maxLength: number): HeatMap {
        let freeMap = this.spaceCalculator.buildFreeMap(hitmap)

        let heatMap = new HeatMap();
        for (let i = 0; i < Settings.boardSize; i++) {
            for (let j = 0; j < Settings.boardSize; j++) {
                if (freeMap[i][j]) {
                    let availableSpaceHorizontal = this.spaceCalculator.calculateSpace(i, j, Orientation.HORIZONTAL, maxLength, freeMap);
                    let availableSpaceVertical = this.spaceCalculator.calculateSpace(i, j, Orientation.VERTICAL, maxLength, freeMap);
                    if (availableSpaceHorizontal >= minLength) {
                        heatMap.applyHeat(i, j, availableSpaceHorizontal);
                    }
                    if (availableSpaceVertical >= minLength) {
                        heatMap.applyHeat(i, j, availableSpaceVertical);
                    }
                }
            }
        }

        return heatMap;
    }
}