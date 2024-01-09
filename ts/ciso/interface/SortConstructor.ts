import {Pillar} from "../model/Pillar";
import {Sort} from "./Sort";

export interface SortConstructor {
    new (pillars : Pillar[]) : Sort;
}