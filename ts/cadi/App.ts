import {Direction} from "../core/enum/Direction";
import {MovementCalculator} from "./interface/MovementCalculator";
import {MovementCalculatorImpl} from "./impl/MovementCalculatorImpl";
import {VelocityCalculator} from "./interface/VelocityCalculator";
import {VelocityCalculatorImpl} from "./impl/VelocityCalculatorImpl";
import {Coord} from "./model/Coord";
import {Coord as BaseCoord} from "../core/model/Coord";
import {Ball} from "./model/Ball";
import {CollisionFreeMovementCalculatorImpl} from "./impl/CollisionFreeMovementCalculatorImpl";
import {CollisionCalculator} from "./interface/CollisionCalculator";
import {CollisionCalculatorImpl} from "./impl/CollisionCalculatorImpl";
import {QuadraticFormulaSolverImpl} from "../core/impl/QuadraticFormulaSolverImpl";
import {CollisionFreeMovementCalculator} from "./interface/CollisionFreeMovementCalculator";
import {CanvasApp} from "../canvas/CanvasApp";
import {CanvasTools} from "../canvas/CanvasTools";
import {HSL} from "../canvas/model/HSL";

export class App extends CanvasApp {

    public static readonly TIMESTEP = 0.1;

    private readonly CLASS_PAUSE = 'fa-pause';
    private readonly CLASS_PLAY = 'fa-play';

    private movementCalculator : MovementCalculator;
    private velocityCalculator : VelocityCalculator;
    private collisionFreeCalculator : CollisionFreeMovementCalculator;
    private collisionCalculator : CollisionCalculator;

    private readonly $gravity = $('#gravity');
    private readonly $showGravity = $('#showGravity');
    private readonly $trail = $('#trail');
    private readonly $showTrail = $('#showTrail');
    private readonly $radius1 = $('#radius1');
    private readonly $showRadius1 = $('#showRadius1');
    private readonly $radius2 = $('#radius2');
    private readonly $showRadius2 = $('#showRadius2');
    private readonly $mass1 = $('#mass1');
    private readonly $showMass1 = $('#showMass1');
    private readonly $mass2 = $('#mass2');
    private readonly $showMass2 = $('#showMass2');
    private readonly $showVelocity = $('#showVelocity');
    private readonly $direction = $('#direction');
    private readonly $pause = $('#pause');

    protected readonly dimensions = new BaseCoord(800, 600);
    private readonly trailMaxLength = 200;
    private readonly trailMaxRadiusPercentage = 0.1;

    private readonly balls : Ball[] = [];
    private calculatedBalls : Ball[] = [];

    private gravityDirection : Direction = Direction.DOWN;
    private changesMade : boolean = false;
    private trailLength : number = 100;
    private isPaused : boolean = false;
    private showVelocity : boolean = false;

    private dragging : number = null;
    private dragTracking : Coord[];
    private drag : BaseCoord;
    private dragBall : Ball;

    constructor() {
        super();
        this.balls.push(new Ball(
            this.dimensions.x/3,
            this.dimensions.y/2 - this.parseFloat(this.$radius1),
            this.parseFloat(this.$radius1),
            this.parseFloatLog(this.$mass1),
            new HSL(0, 80, 60)
        ));
        this.balls.push(new Ball(
            2*this.dimensions.x/3,
            this.dimensions.y/2 - this.parseFloat(this.$radius2),
            this.parseFloat(this.$radius2),
            this.parseFloatLog(this.$mass2),
            new HSL(180, 80, 60)
        ));
        let quadraticFormulaSolver = new QuadraticFormulaSolverImpl();
        this.movementCalculator = new MovementCalculatorImpl(quadraticFormulaSolver);
        this.velocityCalculator = new VelocityCalculatorImpl();
        this.collisionFreeCalculator = new CollisionFreeMovementCalculatorImpl(this.movementCalculator);
        this.collisionCalculator = new CollisionCalculatorImpl(quadraticFormulaSolver);
        this.rangeValueListener(this.$gravity, this.$showGravity);
        this.rangeValueListener(this.$trail, this.$showTrail);
        this.rangeValueListener(this.$radius1, this.$showRadius1);
        this.rangeValueListener(this.$radius2, this.$showRadius2);
        this.rangeValueLogListener(this.$mass1, this.$showMass1);
        this.rangeValueLogListener(this.$mass2, this.$showMass2);
        this.$showVelocity.on('click', () => this.changesMade = true)
        this.$direction.on('change', () => this.changesMade = true);
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

    private parseFloat($input : JQuery) : number {
        return parseFloat($input.val().toString());
    }

    private parseFloatLog($input : JQuery) : number {
        return Math.pow(10, this.parseFloat($input));
    }

    private rangeValueListener($input : JQuery, $showContainer : JQuery) : void {
        $input.on('change input', () => {
            $showContainer.val($input.val());
            this.changesMade = true;
        });
    }

    private rangeValueLogListener($input : JQuery, $showContainer : JQuery) : void {
        $input.on('change input', () => {
            $showContainer.val(Math.round(this.parseFloatLog($input)*100)/100);
            this.changesMade = true;
        });
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
            this.movementCalculator.setGravityConstant(parseFloat(this.$gravity.val().toString()));
            this.trailLength = Math.min(parseInt(this.$trail.val().toString()), this.trailMaxLength);
            this.balls.forEach(ball => {
                if (ball.trail.length > this.trailLength) {
                    ball.trail = ball.trail.slice(ball.trail.length-this.trailLength);
                }
            });
            this.balls[0].radius = this.parseFloat(this.$radius1);
            this.balls[1].radius = this.parseFloat(this.$radius2);
            this.balls[0].mass = this.parseFloatLog(this.$mass1);
            this.balls[1].mass = this.parseFloatLog(this.$mass2);
            this.showVelocity = this.$showVelocity.prop('checked');
            let direction = this.$direction.val().toString();
            this.gravityDirection = direction === '' ? null : Direction[Direction[parseInt(direction)]];
            this.changesMade = false;
        }
    }

    private calc() : void {
        this.balls.forEach(ball => this.calcBall(ball));
        this.calculatedBalls = [];
    }

    private calcBall(ball : Ball) : void {
        if (!this.calculatedBalls.includes(ball)) {
            let collisionResult = this.collisionCalculator.checkCollision(this.balls.filter(b => !this.calculatedBalls.includes(b)), ball, this.gravityDirection);
            if (collisionResult !== null) {
                ball.changeColor();
                collisionResult.collidingBall.changeColor();
                this.calcMovement(ball, collisionResult.time);
                this.calcMovement(collisionResult.collidingBall, collisionResult.time);
                this.collisionCalculator.calculatePostCollisionVelocities(ball, collisionResult.collidingBall, this.gravityDirection);
                this.calcMovement(ball, App.TIMESTEP-collisionResult.time);
                this.calcMovement(collisionResult.collidingBall, App.TIMESTEP-collisionResult.time);
                this.calculatedBalls.push(collisionResult.collidingBall);
            } else {
                this.calcMovement(ball, App.TIMESTEP);
            }
            this.calculatedBalls.push(ball);
        }

        ball.trail.push(new Coord(ball.x, ball.y, ball.color.hue));
        if (ball.trail.length > this.trailLength) {
            ball.trail.shift();
        }
    }

    private calcMovement(ball : Ball, time : number) : void {
        let movementResult = this.collisionFreeCalculator.calculateMovement(ball, this.gravityDirection, this.dimensions, time);

        let otherball = this.balls.find(b => b != ball);
        if (CanvasTools.isBallCollision(ball, otherball)) {
            console.log('missed collision!');
            debugger;
            this.collisionCalculator.checkCollision([otherball], ball, this.gravityDirection);
        }

        ball.x = movementResult.position.x;
        ball.y = movementResult.position.y;
        ball.velocity.x = movementResult.velocity.x;
        ball.velocity.y = movementResult.velocity.y;
        if (movementResult.bounce) ball.changeColor();
    }

    private draw() : void {
        this.context.clearRect(0, 0, this.dimensions.x, this.dimensions.y);
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
        this.context.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2, false);
        this.context.closePath();

        this.context.fillStyle = ball.color.toString();
        this.context.fill();

        if ((this.isPaused || this.showVelocity) && !this.dragging) {
            this.context.beginPath();
            this.context.moveTo(ball.x, ball.y);
            this.context.lineTo(ball.x+ball.velocity.x, ball.y+ball.velocity.y);
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
        let mouseCoord = this.getMouseCoord(e);

        for (let i = 0; i < this.balls.length; i++) {
            let ball = this.balls[i];
            if (CanvasTools.isBallGrab(mouseCoord, ball)) {
                this.dragging = Date.now();
                this.drag = new BaseCoord(mouseCoord.x-ball.x, mouseCoord.y-ball.y);
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
        let mouseCoord = this.getMouseCoord(e);
        let posX = mouseCoord.x - this.drag.x;
        let posY = mouseCoord.y - this.drag.y;
        if (posX < this.dragBall.radius) {
            posX = this.dragBall.radius;
        } else if (posX > this.dimensions.x-this.dragBall.radius) {
            posX = this.dimensions.x-this.dragBall.radius;
        }
        if (posX < this.dragBall.radius) {
            posY = this.dragBall.radius;
        } else if (posY > this.dimensions.y-this.dragBall.radius) {
            posY = this.dimensions.y-this.dragBall.radius;
        }
        this.dragBall.x = posX;
        this.dragBall.y = posY;
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