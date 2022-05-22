import {BaseApp} from "../core/BaseApp";
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
import {QuadraticFormulaSolverImpl} from "./impl/QuadraticFormulaSolverImpl";
import {CollisionFreeMovementCalculator} from "./interface/CollisionFreeMovementCalculator";

export class App extends BaseApp {

    public static readonly TIMESTEP = 0.1;

    private readonly CLASS_PAUSE = 'fa-pause';
    private readonly CLASS_PLAY = 'fa-play';

    private movementCalculator : MovementCalculator;
    private velocityCalculator : VelocityCalculator;
    private collisionFreeCalculator : CollisionFreeMovementCalculator;
    private collisionCalculator : CollisionCalculator;

    private readonly canvas = $('#canvas')[0] as HTMLCanvasElement;
    private readonly context = this.canvas.getContext("2d");
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

    private readonly dimensions = new BaseCoord(800, 600);
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
        this.balls.push(new Ball(parseFloat(this.$radius1.val().toString()), parseFloat(this.$mass1.val().toString()), new BaseCoord(this.dimensions.x/3, this.dimensions.y/2), 0));
        this.balls.push(new Ball(parseFloat(this.$radius2.val().toString()), parseFloat(this.$mass2.val().toString()), new BaseCoord(2*this.dimensions.x/3, this.dimensions.y/2), 180));
        let quadraticFormulaSolver = new QuadraticFormulaSolverImpl();
        this.movementCalculator = new MovementCalculatorImpl(quadraticFormulaSolver);
        this.velocityCalculator = new VelocityCalculatorImpl();
        this.collisionFreeCalculator = new CollisionFreeMovementCalculatorImpl(this.movementCalculator);
        this.collisionCalculator = new CollisionCalculatorImpl(quadraticFormulaSolver);
        this.canvas.width = this.dimensions.x;
        this.canvas.height = this.dimensions.y;
        this.rangeValueListener(this.$gravity, this.$showGravity);
        this.rangeValueListener(this.$trail, this.$showTrail);
        this.rangeValueListener(this.$radius1, this.$showRadius1);
        this.rangeValueListener(this.$radius2, this.$showRadius2);
        this.rangeValueListener(this.$mass1, this.$showMass1);
        this.rangeValueListener(this.$mass2, this.$showMass2);
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

    private rangeValueListener($input : JQuery, $showContainer : JQuery) : void {
        $input.on('change input', () => {
            $showContainer.val($input.val());
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
            this.balls[0].radius = parseFloat(this.$radius1.val().toString());
            this.balls[1].radius = parseFloat(this.$radius2.val().toString());
            this.balls[0].mass = parseFloat(this.$mass1.val().toString());
            this.balls[1].mass = parseFloat(this.$mass2.val().toString());
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

        ball.trail.push(new Coord(ball.coord.x, ball.coord.y, ball.color));
        if (ball.trail.length > this.trailLength) {
            ball.trail.shift();
        }
    }

    private calcMovement(ball : Ball, time : number) : void {
        let movementResult = this.collisionFreeCalculator.calculateMovement(ball, this.gravityDirection, this.dimensions, time);

        let otherball = this.balls.find(b => b != ball);
        if (Math.sqrt(Math.pow(movementResult.position.x-otherball.coord.x,2)+Math.pow(movementResult.position.y-otherball.coord.y,2)) < ball.radius+otherball.radius) {
            console.log('missed collision!');
            debugger;
            this.collisionCalculator.checkCollision([otherball], ball, this.gravityDirection);
        }

        ball.coord.x = movementResult.position.x;
        ball.coord.y = movementResult.position.y;
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
        this.context.arc(ball.coord.x, ball.coord.y, ball.radius, 0, Math.PI * 2, false);
        this.context.closePath();

        this.context.fillStyle = 'hsl('+ball.color+',80%,60%)';
        this.context.fill();

        if ((this.isPaused || this.showVelocity) && !this.dragging) {
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
        let mouseX = (e.clientX - boundingRect.left)*(this.dimensions.x/boundingRect.width);
        let mouseY = (e.clientY - boundingRect.top)*(this.dimensions.y/boundingRect.height);

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
        let mouseX = (e.clientX - boundingRect.left)*(this.dimensions.x/boundingRect.width);
        let mouseY = (e.clientY - boundingRect.top)*(this.dimensions.y/boundingRect.height);
        let posX = mouseX - this.drag.x;
        let posY = mouseY - this.drag.y;
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