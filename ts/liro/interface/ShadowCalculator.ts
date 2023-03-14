import {PillarShadow} from "../model/PillarShadow";
import {Pillar} from "../model/Pillar";

export interface ShadowCalculator {
    calcPillarShadow(pillar : Pillar, otherPillars : Pillar[]) : PillarShadow
    calcPillarGradient(pillar : Pillar, lightSourceMaxReach : number) : CanvasGradient
    calcLightSourceGradient(lightSourceMaxReach : number) : CanvasGradient
}