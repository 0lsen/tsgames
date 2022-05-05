import {BaseApp} from "../core/BaseApp";
import {Direction} from "../core/enum/Direction";
import {MovementCalculator} from "./interface/MovementCalculator";
import {MovementCalculatorImpl} from "./impl/MovementCalculatorImpl";
import {VelocityCalculator} from "./interface/VelocityCalculator";
import {VelocityCalculatorImpl} from "./impl/VelocityCalculatorImpl";
import {Coord} from "./model/Coord";

export class App extends BaseApp {

    private readonly CLASS_PAUSE = 'fa-pause';
    private readonly CLASS_PLAY = 'fa-play';

    private movementCalculator : MovementCalculator;
    private velocityCalculator : VelocityCalculator;

    private readonly canvas = $('#canvas')[0] as HTMLCanvasElement;
    private readonly context = this.canvas.getContext("2d");
    private readonly $gravity = $('#gravity');
    private readonly $showGravity = $('#showGravity');
    private readonly $direction = $('#direction');
    private readonly $pause = $('#pause');

    private readonly width: number = 800;
    private readonly height: number = 600;
    private readonly radius  = 50;
    private readonly trailLength = 100;
    private readonly trailMaxRadius = 5;

    private x : number = this.width/2;
    private y : number = this.height/2;
    private velocityX : number = 0;
    private velocityY : number = 0;
    private gravityDirection : Direction = Direction.DOWN;
    private changesMade : boolean = false;
    private color : number = 0;
    private trail : Coord[] = [];
    private isPaused : boolean = false;

    private dragging : number = null;
    private dragTracking : Coord[];
    private dragX : number;
    private dragY : number;

    constructor() {
        super();
        this.movementCalculator = new MovementCalculatorImpl(this.radius);
        this.velocityCalculator = new VelocityCalculatorImpl();
        this.canvas.width = this.width;
        this.canvas.height = this.height;
        this.$gravity.on('change input', () => {
            this.$showGravity.val(this.$gravity.val());
            this.changesMade = true;
        });
        this.$direction.on('change', () => {
            this.changesMade = true;
        });
        this.$pause.on('click', () => {
            if (this.isPaused) {
                this.$pause.removeClass(this.CLASS_PLAY);
                this.$pause.addClass(this.CLASS_PAUSE);
                this.isPaused = false;
                this.animate();
            } else {
                this.$pause.removeClass(this.CLASS_PAUSE);
                this.$pause.addClass(this.CLASS_PLAY);
                this.isPaused = true;
                this.draw();
            }
        })
        this.canvas.addEventListener('mousedown', this.mouseDownFunc);
        this.checkChanges(true);
        this.animate();
    }

    private animate() : void {
        if (this.dragging === null && !this.isPaused) {
            this.checkChanges();
            this.calc();
            this.draw();
            window.requestAnimationFrame(() => this.animate());
        } else if (this.dragging === null && this.isPaused) {
            this.draw();
        }
    }

    private checkChanges(force = false) : void {
        if (this.changesMade || force) {
            let gravity = parseFloat(this.$gravity.val().toString());
            this.movementCalculator.setGravityConstant(gravity);
            let direction = this.$direction.val().toString();
            this.gravityDirection = direction === '' ? null : Direction[Direction[parseInt(direction)]];
            this.changesMade = false;
        }
    }

    private calc() : void {
        if ([Direction.UP, Direction.DOWN, null].includes(this.gravityDirection)) {
            let calcResult = this.movementCalculator.calcConstantMovement(this.x, this.velocityX, this.width);
            this.x = calcResult.coord;
            if (calcResult.newVelocity) {
                this.changeColor();
                this.velocityX = calcResult.newVelocity;
            }
        } else {
            let calcResult = this.movementCalculator.calcAcceleratedMovement(this.x, this.velocityX, this.width, this.gravityDirection == Direction.LEFT ? -1 : 1);
            if (calcResult.bounce) {
                this.changeColor();
            }
            this.x = calcResult.coord;
            this.velocityX = calcResult.newVelocity;
        }
        if ([Direction.RIGHT, Direction.LEFT, null].includes(this.gravityDirection)) {
            let calcResult = this.movementCalculator.calcConstantMovement(this.y, this.velocityY, this.height);
            this.y = calcResult.coord;
            if (calcResult.newVelocity) {
                this.changeColor();
                this.velocityY = calcResult.newVelocity;
            }
        } else {
            let calcResult = this.movementCalculator.calcAcceleratedMovement(this.y, this.velocityY, this.height, this.gravityDirection == Direction.UP ? -1 : 1);
            if (calcResult.bounce) {
                this.changeColor();
            }
            this.y = calcResult.coord;
            this.velocityY = calcResult.newVelocity;
        }

        this.trail.push(new Coord(this.x, this.y, this.color));
        if (this.trail.length > this.trailLength) {
            this.trail.shift();
        }
    }

    private draw() : void {
        this.context.clearRect(0, 0, this.width, this.height);

        let alpha = 100;
        let width = this.trailMaxRadius;
        for (let i = this.trail.length-2; i >= 0 ; i--) {
            this.context.beginPath();
            this.context.arc(this.trail[i].x, this.trail[i].y, width, 0, Math.PI * 2, false);
            this.context.closePath();
            this.context.fillStyle = 'hsla('+this.trail[i].time+',80%,60%, '+alpha+'%)';
            this.context.fill();
            alpha -= 100/this.trailLength;
            width -= this.trailMaxRadius/this.trailLength;
        }

        this.context.beginPath();
        this.context.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        this.context.closePath();

        this.context.fillStyle = 'hsl('+this.color+',80%,60%)';
        this.context.fill();

        if (this.isPaused && !this.dragging) {
            this.context.beginPath();
            this.context.moveTo(this.x, this.y);
            this.context.lineTo(this.x+this.velocityX, this.y+this.velocityY);
            this.context.closePath();
            this.context.lineWidth = 2;
            this.context.strokeStyle = '#000';
            this.context.stroke();
        }
    }

    private changeColor() : void {
        this.color = (this.color+10)%360;
    }

    private mouseDownFunc = (e) => this.mouseDown(e);
    private mouseMoveFunc = (e) => this.mouseMove(e);
    private mouseUpFunc = (e) => this.mouseUp(e);

    private mouseDown(e) : void {
        let boundingRect = this.canvas.getBoundingClientRect();
        let mouseX = (e.clientX - boundingRect.left)*(this.width/boundingRect.width);
        let mouseY = (e.clientY - boundingRect.top)*(this.height/boundingRect.height);

        let dx = mouseX-this.x;
        let dy = mouseY-this.y;
        if (dx*dx+dy*dy < this.radius*this.radius) {
            this.dragging = Date.now();
            this.dragX = mouseX-this.x;
            this.dragY = mouseY-this.y;
            this.dragTracking = [];
            this.dragTracking.push(new Coord(this.dragX, this.dragY, Date.now()));
            this.trail = [];
            window.addEventListener('mousemove', this.mouseMoveFunc);
        }
        this.canvas.removeEventListener('mousedown', this.mouseDownFunc);
        window.addEventListener('mouseup', this.mouseUpFunc);
    }

    private mouseMove(e) : void {
        let boundingRect = this.canvas.getBoundingClientRect();
        let mouseX = (e.clientX - boundingRect.left)*(this.width/boundingRect.width);
        let mouseY = (e.clientY - boundingRect.top)*(this.height/boundingRect.height);
        let posX = mouseX - this.dragX;
        let posY = mouseY - this.dragY;
        if (posX < this.radius) {
            posX = this.radius;
        } else if (posX > this.width-this.radius) {
            posX = this.width-this.radius;
        }
        if (posX < this.radius) {
            posY = this.radius;
        } else if (posY > this.height-this.radius) {
            posY = this.height-this.radius;
        }
        this.x = posX;
        this.y = posY;
        this.dragTracking.push(new Coord(posX, posY, Date.now()));
        this.draw();
    }

    private mouseUp(e) : void {
        this.canvas.addEventListener('mousedown', this.mouseDownFunc);
        window.removeEventListener("mouseup", this.mouseUpFunc);
        if (this.dragging !== null) {
            window.removeEventListener("mousemove", this.mouseMoveFunc);
            let velocity = this.velocityCalculator.calc(this.dragTracking);
            if (velocity !== null) {
                this.velocityX = velocity.x;
                this.velocityY = velocity.y;
            }
            this.dragging = null;
            this.animate();
        }
    }
}