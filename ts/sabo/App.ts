import {Coord} from "../core/model/Coord";
import {AngleCalculator} from "./interface/AngleCalculator";
import {AngleCalculatorImpl} from "./impl/AngleCalculatorImpl";
import {CanvasApp} from "../canvas/CanvasApp";

export class App extends CanvasApp {

    private angleCalculator : AngleCalculator;

    private readonly $angleOfRepose = $('#angleOfRepose');

    protected readonly _dimensions = new Coord(1000, 500);
    private readonly grainSize = 5;

    private angleOfRepose : number;

    private readonly spawnVariance = 2;
    private readonly spawnDelay = 0;
    private spawnPosition : Coord;
    private spawning = false;
    private lastSpawn : number = 0;

    private readonly tick = 10;

    private floating : Coord[] = [];
    private profile : number[] = Array(this.dimensions.x/this.grainSize).fill(0);

    constructor() {
        super();
        this.angleCalculator = new AngleCalculatorImpl(this.dimensions.x/this.grainSize, this.profile);
        this.setAngleOfRepose();
        this.canvas.addEventListener('mousedown', (e) => this.startSpawn(e));
        this.canvas.addEventListener('mousemove', (e) => this.setSpawn(e));
        this.canvas.addEventListener('mouseup', () => this.stopSpawn());
        this.canvas.addEventListener('mouseout', () => this.stopSpawn());
        this.$resetButton.on('click', () => {
            this.floating = [];
            this.profile.fill(0);
            this.draw();
        });
        this.$angleOfRepose.on('change input', () => {
            $('#showAngleOfRepose').val(this.$angleOfRepose.val().toString()+'°');
            this.setAngleOfRepose();
        });
        this.context.fillStyle = '#000';
        this.doStuff();
    }

    private setAngleOfRepose() : void {
        this.angleOfRepose = parseInt(this.$angleOfRepose.val().toString())
        this.angleCalculator.setAngleOfRepose(this.angleOfRepose);
    }

    private startSpawn(e) : void {
        this.spawning = true;
        this.setSpawn(e);
    }

    private setSpawn(e) : void {
        if (this.spawning) {
            const boundingRect = this.canvas.getBoundingClientRect();
            this.spawnPosition = new Coord(
                Math.round((e.clientX - boundingRect.left)*(this.dimensions.x/boundingRect.width)/this.grainSize),
                this.dimensions.y/this.grainSize-Math.round((e.clientY - boundingRect.top)*(this.dimensions.y/boundingRect.height)/this.grainSize)
            );
        }
    }

    private stopSpawn() : void {
        this.spawning = false;
    }

    private doStuff() : void {
        if (this.spawning) {
            this.spawn();
        }
        if (this.iterate()) {
            this.draw();
        }
        setTimeout(() => this.doStuff(), this.tick);
    }

    private spawn() : void {
        const now = Date.now();
        if (this.lastSpawn <= now-this.spawnDelay) {
            const spawn = new Coord(
                this.spawnPosition.x + Math.round(this.randomizer.randomGaussian(0, this.spawnVariance)),
                this.spawnPosition.y + Math.round(this.randomizer.randomGaussian(0, this.spawnVariance))
            );

            if (this.floating.find(f => f.equals(spawn)) === undefined &&
                spawn.x >= 0 && spawn.x < this.dimensions.x &&
                spawn.y >= 0 && spawn.y < this.dimensions.y &&
                this.profile[spawn.x] < spawn.y
            ) {
                this.floating.push(spawn);
                this.lastSpawn = now;
            }
        }
    }

    private iterate() : boolean {
        let changes = false;
        for (let i = 0; i < this.dimensions.y/this.grainSize; i++) {
            changes = this.iterateLevel(i) || changes;
        }
        return changes;
    }

    private iterateLevel(level : number) : boolean {
        let changes = this.processFloating(level);
        changes = this.processPile(level) || changes;
        return changes;
    }

    private processFloating(level : number) : boolean {
        const changes = !!this.floating.length;
        for (let i = this.floating.length - 1; i >= 0; i--) {
            const grain = this.floating[i];
            if (grain.y == level) {
                if (grain.y-1 == this.profile[grain.x]) {
                    this.profile[grain.x]++;
                    this.floating.splice(i, 1);
                } else {
                    grain.y--;
                }
            }
        }
        return changes;
    }

    private processPile(level : number) : boolean {
        let changes = false;
        let indexLeft = 0;
        let indexRight = this.dimensions.x-1;
        while (indexLeft != indexRight) {
            const useLeft = this.randomizer.randomBool();
            const index = useLeft ? indexLeft : indexRight;
            const p = this.profile[index];
            if (p == level) {
                const angleLeft = this.angleCalculator.calcAngle(index, true);
                const angleRight = this.angleCalculator.calcAngle(index, false);
                if ((angleLeft !== undefined && angleLeft) || (angleRight !== undefined && angleRight > 0)) {
                    const leftSide = this.chooseLeftSide(angleLeft, angleRight);
                    const angle = leftSide ? angleLeft : angleRight;
                    if (angle > this.angleOfRepose) {
                        changes = true;
                        this.profile[index]--;
                        this.profile[leftSide ? index - 1 : index + 1]++;
                    }
                }
            }
            if (useLeft) {
                indexLeft++;
            } else {
                indexRight--;
            }
        }
        return changes;
    }

    private chooseLeftSide(angleLeft : number|undefined, angleRight : number|undefined) : boolean {
        if (angleLeft === undefined) {
            return false;
        } else if (angleRight === undefined) {
            return true;
        } else if (angleLeft === angleRight) {
            return  this.randomizer.randomBool();
        } else {
            return angleLeft > angleRight;
        }
    }

    private draw() : void {
        this.clear();
        this.floating = this.floating.filter(f => f.y >= 0);
        this.floating.forEach(f => {
            this.context.beginPath();
            this.context.rect(f.x*this.grainSize, this.dimensions.y-f.y*this.grainSize, this.grainSize, this.grainSize);
            this.context.closePath();
            this.context.fill();
        });
        this.profile.forEach((p, i) => {
            if (p) {
                this.context.beginPath();
                this.context.rect(i*this.grainSize, this.dimensions.y-p*this.grainSize, this.grainSize, p*this.grainSize);
                this.context.closePath();
                this.context.fill();
            }
        })
    }
}