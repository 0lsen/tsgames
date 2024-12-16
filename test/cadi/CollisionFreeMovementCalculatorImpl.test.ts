import {CollisionFreeMovementCalculatorImpl} from "../../ts/cadi/impl/CollisionFreeMovementCalculatorImpl";
import {MovementCalculatorImpl} from "../../ts/cadi/impl/MovementCalculatorImpl";
import {QuadraticFormulaSolverImpl} from "../../ts/core/impl/QuadraticFormulaSolverImpl";
import {Ball} from "../../ts/cadi/model/Ball";
import {HSL} from "../../ts/canvas/model/HSL";
import {Direction} from "../../ts/core/enum/Direction";
import {Coord} from "../../ts/core/model/Coord";
import {MovementResult} from "../../ts/cadi/model/MovementResult";

const chai = require('chai');
const mocha = require('mocha');

const movementCalculator = new MovementCalculatorImpl(new QuadraticFormulaSolverImpl());
movementCalculator.setGravityConstant(0.0001);
const calc = new CollisionFreeMovementCalculatorImpl(movementCalculator);
const dimensions = new Coord(100, 100);
const ball = new Ball(50, 50, 10, 10, new HSL());

mocha.describe('Canvas CollisionFreeMovementCalculator', () => {

    mocha.it('movement without bounce', () => {
        let result : MovementResult;

        // constant movement has a divider by 10 for whatever strange reason. how the fuck does this even work? o_O
        ball.velocity.x = 150;
        ball.velocity.y = 15;
        result = calc.calculateMovement(ball, Direction.DOWN, dimensions, 1);
        chai.expect(result.bounce).to.be.false;
        chai.expect(Math.round(result.position.x)).to.equal(65);
        chai.expect(Math.round(result.position.y)).to.equal(65);
        chai.expect(result.velocity.x).to.equal(ball.velocity.x);
        chai.expect(result.velocity.y).to.be.greaterThan(ball.velocity.y);
        result = calc.calculateMovement(ball, Direction.UP, dimensions, 1);
        chai.expect(result.bounce).to.be.false;
        chai.expect(Math.round(result.position.x)).to.equal(65);
        chai.expect(Math.round(result.position.x)).to.equal(65);
        chai.expect(result.velocity.x).to.equal(ball.velocity.x);
        chai.expect(result.velocity.y).to.be.lessThan(ball.velocity.y);

        ball.velocity.x = 15;
        ball.velocity.y = 150;
        result = calc.calculateMovement(ball, Direction.RIGHT, dimensions, 1);
        chai.expect(result.bounce).to.be.false;
        chai.expect(Math.round(result.position.x)).to.equal(65);
        chai.expect(Math.round(result.position.y)).to.equal(65);
        chai.expect(result.velocity.y).to.equal(ball.velocity.y);
        chai.expect(result.velocity.x).to.be.greaterThan(ball.velocity.x);
        result = calc.calculateMovement(ball, Direction.LEFT, dimensions, 1);
        chai.expect(result.bounce).to.be.false;
        chai.expect(Math.round(result.position.x)).to.equal(65);
        chai.expect(Math.round(result.position.y)).to.equal(65);
        chai.expect(result.velocity.y).to.equal(ball.velocity.y);
        chai.expect(result.velocity.x).to.be.lessThan(ball.velocity.x);
    });

    mocha.it('movement with bounce', () => {
        let result : MovementResult;
        ball.x = 80;
        ball.y = 80;

        ball.velocity.x = 150;
        ball.velocity.y = 15;
        result = calc.calculateMovement(ball, Direction.DOWN, dimensions, 1);
        chai.expect(result.bounce).to.be.true;
        chai.expect(Math.round(result.position.x)).to.equal(85);
        chai.expect(Math.round(result.position.x)).to.equal(85);
        chai.expect(result.velocity.x).to.equal(-ball.velocity.x);

        ball.velocity.x = 15;
        ball.velocity.y = 150;
        result = calc.calculateMovement(ball, Direction.RIGHT, dimensions, 1);
        chai.expect(result.bounce).to.be.true;
        chai.expect(Math.round(result.position.x)).to.equal(85);
        chai.expect(Math.round(result.position.x)).to.equal(85);
        chai.expect(result.velocity.y).to.equal(-ball.velocity.y);
    });
});