import {Pillar} from "./model/Pillar";
import {InsertionSort} from "./impl/InsertionSort";
import {Sort} from "./interface/Sort";
import {SelectionSort} from "./impl/SelectionSort";
import {SortConstructor} from "./interface/SortConstructor";
import {ScheduleSort} from "./impl/ScheduleSort";
import {CanvasApp} from "../canvas/CanvasApp";
import {Coord} from "../core/model/Coord";
import {DrawHelper} from "./DrawHelper";

export class App extends CanvasApp {

    protected _dimensions = new Coord(600, 600);

    private readonly numberOfValues = 50;
    private readonly minValue = 33;
    private readonly maxValue = 100;
    private readonly animationFrames = 50;

    private drawHelper : DrawHelper;

    private unsortedPillars : Pillar[];

    private isSorting = false;

    private algorithm : Sort;

    private algorithms : SortConstructor[] = [
        InsertionSort,
        SelectionSort,
        ScheduleSort,
    ];

    protected init() {
        super.init();
        this.drawHelper = new DrawHelper(this);
        this.$resetButton.on('click', () => this.reset());
        ScheduleSort.timeoutMultiplier = 50;
        this.reset();
    }

    public sort(index : number) : void {
        if (this.isSorting) return;

        this.algorithm = new this.algorithms[index](this.unsortedPillars);
        this.isSorting = true;
        this.iterate();
    }

    private reset() : void {
        this.isSorting = false;
        this.unsortedPillars = this.createShuffledValues().map(v => new Pillar(v));
        this.draw(this.unsortedPillars);
    }

    private draw(pillars : Pillar[], progress = undefined) : void {
        this.clear();
        const progressAnimation = progress !== undefined && this.algorithm.movingFrom() !== this.algorithm.movingTo();
        this.drawHelper.draw(
            pillars,
            progressAnimation ? this.algorithm.movingFrom() : undefined,
            progressAnimation ? this.algorithm.movingTo() : undefined,
            progress
        );
    }

    private iterate(animationProgress : number = undefined) : void {
        if (!this.isSorting) return;
        if (animationProgress !== undefined && animationProgress < 1) {
            this.draw(this.algorithm.getState(), animationProgress);
            window.requestAnimationFrame(() => this.iterate(animationProgress+1/this.animationFrames));
        } else if (this.algorithm.isSorted()) {
            this.isSorting = false;
            this.draw(this.algorithm.getState());
        } else {
            this.algorithm.iterate();
            this.draw(this.algorithm.getState(), 0);
            window.requestAnimationFrame(() => this.iterate(0));
        }
    }

    private createShuffledValues() : number[] {
        const values = Array(this.numberOfValues).fill(0).map((v, i) => this.minValue + (this.maxValue-this.minValue)*i/this.numberOfValues);
        const shuffledValues = [];
        let failedAssignments = 0;
        values.forEach(value => {
            let index : number;
            do {
                index = this.randomizer.randomInt(this.numberOfValues);
            } while (shuffledValues[index] !== undefined && ++failedAssignments);
            shuffledValues[index] = value;
        });
        // console.log(failedAssignments);
        return shuffledValues;
    }
}