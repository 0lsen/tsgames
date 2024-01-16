import {Sort} from "./Sort";

export interface SortConstructor {
    new (values : number[]) : Sort;
}