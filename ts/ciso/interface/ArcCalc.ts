import {ArcOptions} from "../model/ArcOptions";

export interface ArcCalc {
    setArcWidth(width : number) : void;
    innerArcs(value : number, movingFrom : number, movingTo : number, progress : number) : ArcOptions[];
    outerArcMoving(value : number, index : number, movingFrom : number, movingTo : number, progress : number) : ArcOptions;
    outerArcStatic(value : number, index : number) : ArcOptions;
}