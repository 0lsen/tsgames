import {AbstractSort} from "./AbstractSort";
import {Sort} from "../interface/Sort";
import {MoveMode} from "../enum/MoveMode";

export class StalinSort extends AbstractSort implements Sort {

    private index = 0;
    private purged = 0;
    private sorted = false;

    iterate(): void {
        this._movingFrom = undefined;
        this._movingTo = undefined;
        if (this.index + this.purged == this.values.length) {
            this.sorted = true;
            return;
        }
        for (this.index; this.index < this.values.length; this.index++) {
            if (!this.index) {
                continue;
            }
            if (this.compare(this.values[this.index-1], this.values[this.index])) {
                this._movingFrom = this.index;
                this._movingTo = this.values.length-1;
                this._moveMode = MoveMode.ELIMINATE;
                this.values = this.values.slice(0, this.index)
                    .concat(this.values.slice(this.index+1))
                    .concat(this.values[this.index]);
                this.purged++;
                break;
            }
        }
    }

    isSorted(): boolean {
        return this.sorted;
    }

    getValues(): number[] {
        return this.purged
            ? this.values.slice(0, this.values.length-this.purged)
                .concat(Array(this.purged-(this.sorted ? 0 : 1)).fill(0))
                .concat(this.sorted ? [] : this.values[this.values.length-1])
            : this.values;
    }
}