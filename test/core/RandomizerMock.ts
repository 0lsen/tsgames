import {Randomizer} from "../../ts/core/interface/Randomizer";

export class RandomizerMock<T> implements Randomizer {

    private _intReturns: number[] = [];
    private _gaussReturns: number[] = [];
    private _boolReturns: boolean[] = [];
    private _enumReturns: any[] = [];

    randomInt(max: number): number {
        if (!this._intReturns.length) throw new Error();
        let ret = this._intReturns[0];
        this._intReturns.splice(0, 1);
        return ret;
    }

    randomGaussian(mean: number, stdev: number): number {
        if (!this._gaussReturns.length) throw new Error();
        let ret = this._gaussReturns[0];
        this._gaussReturns.splice(0, 1);
        return ret;
    }

    randomBool(): boolean {
        if (!this._boolReturns.length) throw new Error();
        let ret = this._boolReturns[0];
        this._boolReturns.splice(0, 1);
        return ret;
    }

    randomEnum<T>(e: T): T[keyof T] {
        if (!this._enumReturns.length) throw new Error();
        let ret = this._enumReturns[0];
        this._enumReturns.splice(0, 1);
        return ret;
    }

    verify() : void {
        if (this._intReturns.length || this._gaussReturns.length || this._boolReturns.length || this._enumReturns.length) {
            throw new Error();
        }
    }

    set intReturns(value: number[]) {
        this._intReturns = value;
    }

    set gaussReturns(value: number[]) {
        this._gaussReturns = value;
    }

    set boolReturns(value: boolean[]) {
        this._boolReturns = value;
    }

    set enumReturns(value: any[]) {
        this._enumReturns = value;
    }
}