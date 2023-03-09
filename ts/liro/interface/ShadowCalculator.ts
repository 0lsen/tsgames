import {PillarShadow} from "../model/PillarShadow";
import {Pillar} from "../model/Pillar";

export interface ShadowCalculator {
    calcShadow(pillar : Pillar, otherPillars : Pillar[]) : PillarShadow
}