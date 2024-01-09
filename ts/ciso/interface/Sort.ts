import {Pillar} from "../model/Pillar";

export interface Sort {
    iterate() : void;
    isSorted() : boolean;
    getState() : Pillar[];
    movingFrom() : number;
    movingTo() : number;
}