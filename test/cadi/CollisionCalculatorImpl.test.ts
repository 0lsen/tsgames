import {CollisionCalculatorImpl} from "../../ts/cadi/impl/CollisionCalculatorImpl";
import {QuadraticFormulaSolverImpl} from "../../ts/cadi/impl/QuadraticFormulaSolverImpl";
import {Ball} from "../../ts/cadi/model/Ball";
import {Coord} from "../../ts/core/model/Coord";
import {Direction} from "../../ts/core/enum/Direction";

const chai = require('chai');
const mocha = require('mocha');

const calculator = new CollisionCalculatorImpl(new QuadraticFormulaSolverImpl());

let r1 = 20;
let m1 = 10;
let x1 = 50;
let y1 = 50;
let v1x = 50;
let v1y = 25;

let r2 = 30;
let m2 = 10;
let x2 = 200;
let y2 = 60;
let v2x = -50;
let v2y = 20;

let createBalls = () => {
    let ball1 = new Ball(
        r1,
        m1,
        new Coord(x1, y1),
        0
    );
    ball1.velocity.x = v1x;
    ball1.velocity.y = v1y;
    let ball2 = new Ball(
        r2,
        m2,
        new Coord(x2, y2),
        0
    );
    ball2.velocity.x = v2x;
    ball2.velocity.y = v2y;

    return [ball1, ball2];
};

mocha.describe('Canvas Collision Calculator collision detection', () => {

    mocha.it('balls do not collide within time frame', () => {
        let balls = createBalls();
        let result = calculator.checkCollision(balls, balls[0], Direction.DOWN);
        chai.expect(result).to.be.null;
    });

    mocha.it('balls do collide', () => {
        v1x = 600;
        v2x = -600;
        let balls = createBalls();
        let result = calculator.checkCollision(balls, balls[0], Direction.DOWN);
        chai.expect(result).to.not.be.null;
        if (result !== null)
            chai.expect(Math.round(result.time*100_000)).to.equal(8411);
    });

    mocha.it('balls dont move on one axis (in big distance)', () => {
        v1x = 0;
        v2x = 0;
        let balls = createBalls();
        let result = calculator.checkCollision(balls, balls[0], Direction.DOWN);
        chai.expect(result).to.be.null;
    });

    mocha.it('balls dont move on one axis (in small distance and collide)', () => {
        x1 = 180;
        y1 = 120;
        v1y = -400;
        let balls = createBalls();
        let result = calculator.checkCollision(balls, balls[0], Direction.DOWN);
        chai.expect(result).to.not.be.null;
        if (result !== null)
            chai.expect(Math.round(result.time*100_000)).to.equal(3375);
    });
});

mocha.describe('Canvas Collision Calculator velocity calculation', () => {

    mocha.it('horizontal head on collision with equal mass and same inverted speed', () => {
        m1 = 10;
        m2 = 10;
        v1x = 0;
        v2x = 0;
        v1y = 10;
        v2y = -10;
        x1 = 0;
        x2 = 0;
        y1 = 50;
        y2 = 100;
        let balls = createBalls();
        calculator.calculatePostCollisionVelocities(balls[0], balls[1], Direction.DOWN);
        chai.expect(balls[0].velocity.x).to.equal(0);
        chai.expect(balls[0].velocity.y).to.equal(-10);
        chai.expect(balls[1].velocity.x).to.equal(0);
        chai.expect(balls[1].velocity.y).to.equal(10);
    });

    mocha.it('vertical head on collision with equal mass and same inverted speed', () => {
        m1 = 10;
        m2 = 10;
        v1x = 10;
        v2x = -10;
        v1y = 0;
        v2y = 0;
        x1 = 50;
        x2 = 100;
        y1 = 0;
        y2 = 0;
        let balls = createBalls();
        calculator.calculatePostCollisionVelocities(balls[0], balls[1], Direction.DOWN);
        chai.expect(balls[0].velocity.x).to.equal(-10);
        chai.expect(balls[0].velocity.y).to.equal(0);
        chai.expect(balls[1].velocity.x).to.equal(10);
        chai.expect(balls[1].velocity.y).to.equal(0);
    });

    mocha.it('horizontal head on collision with double mass and same inverted speed', () => {
        m1 = 20;
        m2 = 10;
        v1x = 0;
        v2x = 0;
        v1y = 10;
        v2y = -10;
        x1 = 0;
        x2 = 0;
        y1 = 50;
        y2 = 100;
        let balls = createBalls();
        calculator.calculatePostCollisionVelocities(balls[0], balls[1], Direction.DOWN);
        chai.expect(Math.round(balls[0].velocity.x*1000)).to.equal(0);
        chai.expect(Math.round(balls[0].velocity.y*1000)).to.equal(-3333);
        chai.expect(Math.round(balls[1].velocity.x*1000)).to.equal(0);
        chai.expect(Math.round(balls[1].velocity.y*1000)).to.equal(16667);
    });

    mocha.it('90deg collision with equal mass and speed', () => {
        m1 = 10;
        m2 = 10;
        v1x = 10;
        v2x = 0;
        v1y = 0;
        v2y = -10;
        x1 = 0;
        x2 = 50/Math.sqrt(2);
        y1 = 0;
        y2 = 50/Math.sqrt(2);
        let balls = createBalls();
        calculator.calculatePostCollisionVelocities(balls[0], balls[1], Direction.DOWN);
        chai.expect(balls[0].velocity.x).to.equal(0);
        chai.expect(balls[0].velocity.y).to.equal(-10);
        chai.expect(balls[1].velocity.x).to.equal(10);
        chai.expect(balls[1].velocity.y).to.equal(0);
    });
});