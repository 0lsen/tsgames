export interface Sort {
    iterate() : void;
    isSorted() : boolean;
    getValues() : number[];
    movingFrom() : number;
    movingTo() : number;
}