import {InsertionSort} from "./impl/InsertionSort";
import {Sort} from "./interface/Sort";
import {SelectionSort} from "./impl/SelectionSort";
import {SortConstructor} from "./interface/SortConstructor";
import {ScheduleSort} from "./impl/ScheduleSort";
import {CanvasApp} from "../canvas/CanvasApp";
import {Coord} from "../core/model/Coord";
import {DrawHelper} from "./DrawHelper";
import {MergeSort} from "./impl/MergeSort";
import {HeapSort} from "./impl/HeapSort";
import {AnimationOptions} from "./model/AnimationOptions";
import {QuickSort} from "./impl/QuickSort";
import {BubbleSort} from "./impl/BubbleSort";
import {StalinSort} from "./impl/StalinSort";
import {RadixSort} from "./impl/RadixSort";
import {MoveMode} from "./enum/MoveMode";
import {BogoSort} from "./impl/BogoSort";

export class App extends CanvasApp {

    protected _dimensions = new Coord(600, 600);

    private readonly $numberOfValues = $('#numberOfValues');

    private readonly minValue = 33;
    private readonly maxValue = 100;

    private drawHelper : DrawHelper;

    private unsortedValues : number[];

    private isSorting = false;

    private algorithm : Sort;

    private algorithms : SortConstructor[] = [
        InsertionSort,
        SelectionSort,
        MergeSort,
        HeapSort,
        QuickSort,
        BubbleSort,
        RadixSort,
        ScheduleSort,
        StalinSort,
        BogoSort,
    ];

    protected init() {
        super.init();
        this.drawHelper = new DrawHelper(this);
        this.$resetButton.on('click', () => this.reset());
        ScheduleSort.timeoutMultiplier = 50;
        BogoSort.randomizer = this.randomizer;
        this.reset();
    }

    public sort(index : number) : void {
        if (this.isSorting) return;

        this.algorithm = new this.algorithms[index](this.unsortedValues);
        this.isSorting = true;
        this.iterate();
    }

    private reset() : void {
        this.isSorting = false;
        this.unsortedValues = this.createShuffledValues();
        this.draw(this.unsortedValues, 0);
    }

    private draw(values : number[], comparisons : number, progress : number = undefined) : void {
        this.clear();
        const progressAnimation = this.isAnimationInProgress(progress);
        const animationOptions = new AnimationOptions(
            values,
            progressAnimation ? this.algorithm.movingFrom() : undefined,
            progressAnimation ? this.algorithm.movingTo() : undefined,
            progress,
            progressAnimation ? this.algorithm.moveMode() : undefined
        );
        this.drawHelper.draw(animationOptions, comparisons);
    }

    private iterate(animationProgress : number = undefined) : void {
        if (!this.isSorting) return;
        if (animationProgress !== undefined && animationProgress < 1) {
            this.draw(this.algorithm.getValues(), this.algorithm.comparisons(), animationProgress);
            this.requestRecursiveAnimationFrame(() => this.iterate(animationProgress+1/this.fps));
        } else if (this.algorithm.isSorted()) {
            this.isSorting = false;
            this.draw(this.algorithm.getValues(), this.algorithm.comparisons());
        } else {
            this.algorithm.iterate();
            this.draw(this.algorithm.getValues(), this.algorithm.comparisons(), 0);
            const hasMovement = this.algorithm.movingFrom() !== undefined && this.algorithm.movingTo() !== undefined;
            this.requestRecursiveAnimationFrame(() => this.iterate(hasMovement ? 0 : undefined));
        }
    }

    private createShuffledValues() : number[] {
        const numberOfValues = parseInt(this.$numberOfValues.val().toString());
        const values = Array(numberOfValues).fill(0).map((v, i) => this.minValue + (this.maxValue-this.minValue)*i/numberOfValues);
        const shuffledValues = [];
        let failedAssignments = 0;
        values.forEach(value => {
            let index : number;
            do {
                index = this.randomizer.randomInt(numberOfValues);
            } while (shuffledValues[index] !== undefined && ++failedAssignments);
            shuffledValues[index] = value;
        });
        // console.log(failedAssignments);
        return shuffledValues;
    }

    private isAnimationInProgress(progress : number) : boolean {
        return progress !== undefined &&
        (
            this.algorithm.movingFrom() !== this.algorithm.movingTo() ||
            this.algorithm.moveMode() === MoveMode.ELIMINATE
        );
    }
}