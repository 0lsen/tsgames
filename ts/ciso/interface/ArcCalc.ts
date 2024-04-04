import {ArcOptions} from "../model/ArcOptions";
import {AnimationOptions} from "../model/AnimationOptions";

export interface ArcCalc {
    setArcWidth(width : number) : void;
    innerArcs(value : number, options : AnimationOptions) : ArcOptions[];
    outerArcMoving(value : number, index : number, options : AnimationOptions) : ArcOptions;
    outerArcStatic(value : number, index : number) : ArcOptions;
    outerArcElimination(value : number, options : AnimationOptions) : ArcOptions;
}