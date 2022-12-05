import {Randomizer} from "../../ts/core/interface/Randomizer";

export class RandomizerMock<T> implements Randomizer {

    private intReturns: number[];
    private boolReturns: boolean[];
    private enumReturns: any[];

    constructor(intReturns: number[], boolReturns: boolean[], enumReturns: any[]) {
        this.intReturns = intReturns;
        this.boolReturns = boolReturns;
        this.enumReturns = enumReturns;
    }

    randomInt(max: number): number {
        if (!this.intReturns.length) throw new Error();
        let ret = this.intReturns[0];
        this.intReturns.splice(0, 1);
        return ret;
    }

    randomBool(): boolean {
        if (!this.boolReturns.length) throw new Error();
        let ret = this.boolReturns[0];
        this.boolReturns.splice(0, 1);
        return ret;
    }

    randomEnum<T>(e: T): T[keyof T] {
        if (!this.enumReturns.length) throw new Error();
        let ret = this.enumReturns[0];
        this.enumReturns.splice(0, 1);
        return ret;
    }

    verify() : void {
        if (this.intReturns.length || this.boolReturns.length || this.enumReturns.length) {
            throw new Error();
        }
    }
}