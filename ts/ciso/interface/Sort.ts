import {MoveMode} from "../enum/MoveMode";

export interface Sort {
    iterate() : void;
    isSorted() : boolean;
    getValues() : number[];
    movingFrom() : number;
    movingTo() : number;
    moveMode() : MoveMode;
    comparisons(): number;
}