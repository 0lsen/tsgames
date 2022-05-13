import {BaseApp} from "../core/BaseApp";
import {Settings} from "./Settings";
import {Direction} from "../core/enum/Direction";
import {Coord} from "../core/model/Coord";

export class App extends BaseApp {

    private readonly CLASS_LOST = 'lost';
    private readonly CLASS_HEAD = 'head';
    private readonly CLASS_BODY = 'body';
    private readonly CLASS_TAIL = 'tail';
    private readonly CLASS_FOOD = 'food';
    private readonly CLASS_NORTH = 'north';
    private readonly CLASS_EAST = 'east';
    private readonly CLASS_SOUTH = 'south';
    private readonly CLASS_WEST = 'west';

    private readonly $body = $('body');
    private readonly $board = $('#board');
    private readonly $start = $('#start');
    private readonly $speed = $('#speed');

    private settings : Settings = new Settings();

    private foodPosition : Coord;
    private headPosition : Coord;
    private bodyPositions : Coord[];
    private direction : Direction;
    private directionChange : boolean = false;
    private isRunning : boolean = false;

    constructor() {
        super();
        this.build();
        this.$start.on('click', () => this.start());
        this.$body.on('keydown', (e) => {
            if (this.directionChange) return;
            if (e.key == 'ArrowLeft' && this.direction != Direction.RIGHT) this.changeDirection(Direction.LEFT);
            if (e.key == 'ArrowUp' && this.direction != Direction.DOWN) this.changeDirection(Direction.UP);
            if (e.key == 'ArrowRight' && this.direction != Direction.LEFT) this.changeDirection(Direction.RIGHT);
            if (e.key == 'ArrowDown' && this.direction != Direction.UP) this.changeDirection(Direction.DOWN);
        });
    }

    private build() : void {
        this.$board.empty();
        for (let i = 0; i < this.settings.height; i++) {
            let $row = $('<div></div>');
            for (let j = 0; j < this.settings.width; j++) {
                $row.append(this.cell);
            }
            this.$board.append($row);
        }
    }

    private cell() : JQuery {
        let $cell = $('<div></div>');
        for (let i = 0; i < 9; i++) {
            $cell.append('<div></div>');
        }
        return $cell;
    }

    private changeDirection(direction : Direction) : void {
        this.direction = direction;
        this.directionChange = true;
    }

    private getSpeed() : number {
        return Math.max(1, Math.min(10, parseInt(this.$speed.val().toString())));
    }

    private start() : void {
        if (this.isRunning) return;

        this.bodyPositions = [];
        this.headPosition = new Coord(this.settings.startX, this.settings.startY);
        this.direction = Direction.UP;
        this.$board.removeClass(this.CLASS_LOST);
        this.$board.find('div').removeClass(this.CLASS_HEAD);
        this.$board.find('div').removeClass(this.CLASS_BODY);
        this.$board.find('div').removeClass(this.CLASS_TAIL);
        this.placeFood();
        this.placeHead();
        this.settings.speed = this.getSpeed();
        this.isRunning = true;
        this.slither();
    }

    private slither() : void {
        this.bodyPositions.push(new Coord(this.headPosition.x, this.headPosition.y));
        let newY = this.headPosition.y;
        if (this.direction == Direction.UP) newY--;
        if (this.direction == Direction.DOWN) newY++;
        let newX = this.headPosition.x;
        if (this.direction == Direction.RIGHT) newX++;
        if (this.direction == Direction.LEFT) newX--;
        this.directionChange = false;
        let newHeadPosition = new Coord(newX, newY);

        if (this.collision(newHeadPosition)) {
            this.$board.addClass(this.CLASS_LOST);
            this.isRunning = false;
        } else {
            let foodConsumed = newHeadPosition.equals(this.foodPosition);
            if (foodConsumed) {
                this.placeFood();
            } else {
                if (this.bodyPositions.length > 1) {
                    this.removeClass(this.bodyPositions[1], this.CLASS_BODY);
                    this.addClass(this.bodyPositions[1], this.CLASS_TAIL);
                }
                this.clearCell(this.bodyPositions[0]);
                this.bodyPositions.shift();
            }
            this.addClass(newHeadPosition, this.CLASS_HEAD);
            if (this.bodyPositions.length) {
                this.addClass(this.headPosition, this.bodyPositions.length > 1 ? this.CLASS_BODY : this.CLASS_TAIL);
            }
            this.removeClass(this.headPosition, this.CLASS_HEAD);
            this.headPosition = newHeadPosition;
            this.setHeadOrientation();
            this.setTailOrientation();
            setTimeout(() => this.slither(), 1200/this.settings.speed);
        }
    }

    private placeFood() : void {
        this.$board.find('div').removeClass(this.CLASS_FOOD);
        if (this.bodyPositions.length <= this.settings.width * this.settings.height - 2) {
            do {
                this.foodPosition = new Coord(
                    this.randomizer.randomInt(this.settings.width),
                    this.randomizer.randomInt(this.settings.height)
                );
            } while (!this.foodPositionValid());
            this.addClass(this.foodPosition, this.CLASS_FOOD);
        }
    }

    private placeHead() : void {
        this.addClass(this.headPosition, this.CLASS_HEAD);
    }

    private getCell(position: Coord) : JQuery {
        return this.$board.find(' > div:nth-child('+(position.y+1)+') > div:nth-child('+(position.x+1)+')');
    }

    private addClass(position : Coord, clazz : string) : void {
        this.getCell(position).addClass(clazz);
    }

    private removeClass(position : Coord, clazz : string) : void {
        this.getCell(position).removeClass(clazz);
    }

    private clearCell(position : Coord) : void {
        this.getCell(position).removeClass();
    }

    private setHeadOrientation() : void {
        this.removeDirections(this.headPosition);
        if (this.bodyPositions.length) {
            let neck = this.bodyPositions.at(-1);
            if (neck.x != this.headPosition.x) {
                this.addClass(neck, neck.x > this.headPosition.x ? this.CLASS_WEST : this.CLASS_EAST);
                this.addClass(this.headPosition, neck.x > this.headPosition.x ? this.CLASS_EAST : this.CLASS_WEST);
            } else {
                this.addClass(neck, neck.y > this.headPosition.y ? this.CLASS_NORTH : this.CLASS_SOUTH);
                this.addClass(this.headPosition, neck.y > this.headPosition.y ? this.CLASS_SOUTH : this.CLASS_NORTH);
            }
        }
    }

    private setTailOrientation() : void {
        if (this.bodyPositions.length) {
            let tail = this.bodyPositions[0];
            let torso = this.bodyPositions.length > 1 ? this.bodyPositions[1] : this.headPosition;
            this.removeDirections(tail);
            if (tail.x != torso.x) {
                this.addClass(tail, torso.x > tail.x ? this.CLASS_EAST : this.CLASS_WEST);
            } else {
                this.addClass(tail, torso.y > tail.y ? this.CLASS_SOUTH : this.CLASS_NORTH);
            }
        }
    }

    private removeDirections(position : Coord) : void {
        this.removeClass(position, this.CLASS_NORTH);
        this.removeClass(position, this.CLASS_EAST);
        this.removeClass(position, this.CLASS_SOUTH);
        this.removeClass(position, this.CLASS_WEST);
    }

    private foodPositionValid() : boolean {
        return !this.headPosition.equals(this.foodPosition) && this.bodyPositions.find(p => p.equals(this.foodPosition)) === undefined;
    }
    
    private collision(newHeadPosition : Coord) : boolean {
        if (newHeadPosition.x < 0 || newHeadPosition.y < 0 || newHeadPosition.x >= this.settings.width || newHeadPosition.y >= this.settings.height) {
            return true;
        }
        return this.bodyPositions.find(p => p.equals(newHeadPosition)) !== undefined;
    }
}