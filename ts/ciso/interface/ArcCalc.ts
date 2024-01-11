import {ArcOptions} from "../model/ArcOptions";
import {Pillar} from "../model/Pillar";

export interface ArcCalc {
    setArcWidth(width : number) : void;
    innerArcs(pillar : Pillar, movingFrom : number, movingTo : number, progress : number) : ArcOptions[];
    outerArcMoving(pillar : Pillar, index : number, movingFrom : number, movingTo : number, progress : number) : ArcOptions;
    outerArcStatic(pillar : Pillar, index : number) : ArcOptions;
}