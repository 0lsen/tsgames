import {SpaceCalculator} from "../interface/SpaceCalculator";
import {HitMap} from "../model/HitMap";
import {Orientation} from "../enum/Orientation";
import {Settings} from "../Settings";

export class SpaceCalculatorImpl implements SpaceCalculator {
    buildFreeMap(hitmap: HitMap): boolean[][] {
        let map = new Array(Settings.boardSize);
        for (let i = 0; i < Settings.boardSize; i++) {
            map[i] = new Array(Settings.boardSize);
        }
        for (let i = 0; i < Settings.boardSize; i++) {
            for (let j = 0; j < Settings.boardSize; j++) {
                map[i][j] = !hitmap.alreadyHit(i, j);
            }
        }
        return map;
    }

    calculateSpace(x: number, y: number, orientation: Orientation, maxLength: number, freeMap: boolean[][]): number {
        let space = 1; let i = x; let j = y;
        while (
            (orientation == Orientation.HORIZONTAL ? i : j) < Settings.boardSize-1 &&
            (orientation == Orientation.HORIZONTAL ? i-x+1 : j-y+1) < maxLength &&
            freeMap[orientation == Orientation.HORIZONTAL ? i+1 : i][orientation == Orientation.HORIZONTAL ? j : j+1]
            ) {
            if (orientation == Orientation.HORIZONTAL) {
                i++;
            } else {
                j++;
            }
            space++;
        }
        i = x; j = y;
        while (
            (orientation == Orientation.HORIZONTAL ? i : j) > 0 &&
            (orientation == Orientation.HORIZONTAL ? x-i+1 : y-j+1) < maxLength &&
            freeMap[orientation == Orientation.HORIZONTAL ? i-1 : i][orientation == Orientation.HORIZONTAL ? j : j-1]
            ) {
            if (orientation == Orientation.HORIZONTAL) {
                i--;
            } else {
                j--;
            }
            space++;
        }
        return space;
    }
}