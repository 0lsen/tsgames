import {AbstractSort} from "./AbstractSort";
import {Sort} from "../interface/Sort";
import {Randomizer} from "../../core/interface/Randomizer";

export class BogoSort extends AbstractSort implements Sort {

    private static _randomizer : Randomizer;

    constructor(values: number[]) {
        super(values);
    }

    iterate(): void {
        if (!this.isSorted()) {
            this.values = this.values.sort((v1, v2) => BogoSort._randomizer.randomIntBetween(-1, 2));
        }
    }

    isSorted(): boolean {
        return undefined !== this.values.reduce(
            (p, c) => p === undefined ? p : (this.compare(p, c) ? c : undefined),
            -Infinity
        );
    }

    getValues(): number[] {
        return this.values;
    }

    static set randomizer(value: Randomizer) {
        this._randomizer = value;
    }
}