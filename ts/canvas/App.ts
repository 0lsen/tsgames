import {BaseApp} from "../core/BaseApp";
import {Direction} from "../core/enum/Direction";
import {MovementCalculator} from "./interface/MovementCalculator";
import {MovementCalculatorImpl} from "./impl/MovementCalculatorImpl";
import {VelocityCalculator} from "./interface/VelocityCalculator";
import {VelocityCalculatorImpl} from "./impl/VelocityCalculatorImpl";
import {Coord} from "./model/Coord";
import {Coord as BaseCoord} from "../core/model/Coord";
import {Ball} from "./model/Ball";

export class App extends BaseApp {

    private readonly CLASS_PAUSE = 'fa-pause';
    private readonly CLASS_PLAY = 'fa-play';

    private movementCalculator : MovementCalculator;
    private velocityCalculator : VelocityCalculator;

    private readonly canvas = $('#canvas')[0] as HTMLCanvasElement;
    private readonly context = this.canvas.getContext("2d");
    private readonly $gravity = $('#gravity');
    private readonly $showGravity = $('#showGravity');
    private readonly $trail = $('#trail');
    private readonly $showTrail = $('#showTrail');
    private readonly $direction = $('#direction');
    private readonly $pause = $('#pause');

    private readonly width: number = 800;
    private readonly height: number = 600;
    private readonly trailMaxLength = 200;
    private readonly trailMaxRadiusPercentage = 0.1;

    private readonly balls : Ball[] = [];

    private gravityDirection : Direction = Direction.DOWN;
    private changesMade : boolean = false;
    private trailLength : number = 100;
    private isPaused : boolean = false;

    private dragging : number = null;
    private dragTracking : Coord[];
    private drag : BaseCoord;
    private dragBall : Ball;

    constructor() {
        super();
        this.balls.push(new Ball(50, new BaseCoord(this.width/3, this.height/3), 0));
        this.balls.push(new Ball(30, new BaseCoord(2*this.width/3, 2*this.height/3), 180));
        this.movementCalculator = new MovementCalculatorImpl();
        this.velocityCalculator = new VelocityCalculatorImpl();
        this.canvas.width = this.width;
        this.canvas.height = this.height;
        this.$gravity.on('change input', () => {
            this.$showGravity.val(this.$gravity.val());
            this.changesMade = true;
        });
        this.$trail.on('change input', () => {
            this.$showTrail.val(this.$trail.val());
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
            this.trailLength = Math.min(parseInt(this.$trail.val().toString()), this.trailMaxLength);
            this.balls.forEach(ball => {
                if (ball.trail.length > this.trailLength) {
                    ball.trail = ball.trail.slice(ball.trail.length-this.trailLength);
                }
            });
            let direction = this.$direction.val().toString();
            this.gravityDirection = direction === '' ? null : Direction[Direction[parseInt(direction)]];
            this.changesMade = false;
        }
    }

    private calc() : void {
        this.balls.forEach(ball => this.calcBall(ball));
    }

    private calcBall(ball : Ball) : void {
        if ([Direction.UP, Direction.DOWN, null].includes(this.gravityDirection)) {
            let calcResult = this.movementCalculator.calcConstantMovement(ball.coord.x, ball.velocity.x, this.width, ball.radius);
            ball.coord.x = calcResult.coord;
            if (calcResult.newVelocity) {
                ball.changeColor();
                ball.velocity.x = calcResult.newVelocity;
            }
        } else {
            let calcResult = this.movementCalculator.calcAcceleratedMovement(ball.coord.x, ball.velocity.x, this.width, ball.radius, this.gravityDirection == Direction.LEFT ? -1 : 1);
            if (calcResult.bounce) {
                ball.changeColor();
            }
            ball.coord.x = calcResult.coord;
            ball.velocity.x = calcResult.newVelocity;
        }
        if ([Direction.RIGHT, Direction.LEFT, null].includes(this.gravityDirection)) {
            let calcResult = this.movementCalculator.calcConstantMovement(ball.coord.y, ball.velocity.y, ball.radius, this.height);
            ball.coord.y = calcResult.coord;
            if (calcResult.newVelocity) {
                ball.changeColor();
                ball.velocity.y = calcResult.newVelocity;
            }
        } else {
            let calcResult = this.movementCalculator.calcAcceleratedMovement(ball.coord.y, ball.velocity.y, this.height, ball.radius, this.gravityDirection == Direction.UP ? -1 : 1);
            if (calcResult.bounce) {
                ball.changeColor();
            }
            ball.coord.y = calcResult.coord;
            ball.velocity.y = calcResult.newVelocity;
        }

        ball.trail.push(new Coord(ball.coord.x, ball.coord.y, ball.color));
        if (ball.trail.length > this.trailLength) {
            ball.trail.shift();
        }
    }

    private draw() : void {
        this.context.clearRect(0, 0, this.width, this.height);
        this.balls.forEach(ball => this.drawBall(ball));
    }

    private drawBall(ball : Ball) : void {
        let alpha = 100;
        let width = this.trailMaxRadiusPercentage;
        for (let i = ball.trail.length-2; i >= 0 ; i--) {
            this.context.beginPath();
            this.context.arc(ball.trail[i].x, ball.trail[i].y, ball.radius*width, 0, Math.PI * 2, false);
            this.context.closePath();
            this.context.fillStyle = 'hsla('+ball.trail[i].time+',80%,60%, '+alpha+'%)';
            this.context.fill();
            alpha -= 100/ball.trail.length;
            width -= this.trailMaxRadiusPercentage/ball.trail.length;
        }

        this.context.beginPath();
        this.context.arc(ball.coord.x, ball.coord.y, ball.radius, 0, Math.PI * 2, false);
        this.context.closePath();

        this.context.fillStyle = 'hsl('+ball.color+',80%,60%)';
        this.context.fill();

        if (this.isPaused && !this.dragging) {
            this.context.beginPath();
            this.context.moveTo(ball.coord.x, ball.coord.y);
            this.context.lineTo(ball.coord.x+ball.velocity.x, ball.coord.y+ball.velocity.y);
            this.context.closePath();
            this.context.lineWidth = 2;
            this.context.strokeStyle = '#000';
            this.context.stroke();
        }
    }

    private mouseDownFunc = (e) => this.mouseDown(e);
    private mouseMoveFunc = (e) => this.mouseMove(e);
    private mouseUpFunc = (e) => this.mouseUp(e);

    private mouseDown(e) : void {
        let boundingRect = this.canvas.getBoundingClientRect();
        let mouseX = (e.clientX - boundingRect.left)*(this.width/boundingRect.width);
        let mouseY = (e.clientY - boundingRect.top)*(this.height/boundingRect.height);

        for (let i = 0; i < this.balls.length; i++) {
            let ball = this.balls[i];
            let dx = mouseX-ball.coord.x;
            let dy = mouseY-ball.coord.y;
            if (dx*dx+dy*dy < ball.radius*ball.radius) {
                this.dragging = Date.now();
                this.drag = new BaseCoord(mouseX-ball.coord.x, mouseY-ball.coord.y);
                this.dragBall = ball;
                this.dragTracking = [];
                this.dragTracking.push(new Coord(this.drag.x, this.drag.y, Date.now()));
                ball.trail = [];
                window.addEventListener('mousemove', this.mouseMoveFunc);
                break;
            }
        }
        this.canvas.removeEventListener('mousedown', this.mouseDownFunc);
        window.addEventListener('mouseup', this.mouseUpFunc);
    }

    private mouseMove(e) : void {
        let boundingRect = this.canvas.getBoundingClientRect();
        let mouseX = (e.clientX - boundingRect.left)*(this.width/boundingRect.width);
        let mouseY = (e.clientY - boundingRect.top)*(this.height/boundingRect.height);
        let posX = mouseX - this.drag.x;
        let posY = mouseY - this.drag.y;
        if (posX < this.dragBall.radius) {
            posX = this.dragBall.radius;
        } else if (posX > this.width-this.dragBall.radius) {
            posX = this.width-this.dragBall.radius;
        }
        if (posX < this.dragBall.radius) {
            posY = this.dragBall.radius;
        } else if (posY > this.height-this.dragBall.radius) {
            posY = this.height-this.dragBall.radius;
        }
        this.dragBall.coord.x = posX;
        this.dragBall.coord.y = posY;
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
                this.dragBall.velocity.x = velocity.x;
                this.dragBall.velocity.y = velocity.y;
            }
            this.dragging = null;
            this.animate();
        }
    }
}