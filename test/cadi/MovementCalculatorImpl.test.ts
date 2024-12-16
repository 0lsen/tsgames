import {MovementCalculatorImpl} from "../../ts/cadi/impl/MovementCalculatorImpl";
import {QuadraticFormulaSolverImpl} from "../../ts/core/impl/QuadraticFormulaSolverImpl";
import {CalcResult} from "../../ts/cadi/model/CalcResult";

const chai = require('chai');
const mocha = require('mocha');

const calculator = new MovementCalculatorImpl(new QuadraticFormulaSolverImpl());

const round = (x : number) => Math.round(x*100)/100;

mocha.describe('Canvas Movement Calc', () => {
    let result : CalcResult;
    calculator.setGravityConstant(10);

    mocha.it('constant movement without bounce', () => {
        result = calculator.calcConstantMovement(0, 100, 100, 10);
        chai.expect(result.coord).to.equal(10);
        chai.expect(result.newVelocity).to.be.null;
        chai.expect(result.bounce).to.be.null;

        result = calculator.calcConstantMovement(80, 100, 100, 10);
        chai.expect(result.coord).to.equal(90);
        chai.expect(result.newVelocity).to.be.null;
        chai.expect(result.bounce).to.be.null;

        result = calculator.calcConstantMovement(100, -100, 0, 10);
        chai.expect(result.coord).to.equal(90);
        chai.expect(result.newVelocity).to.be.null;
        chai.expect(result.bounce).to.be.null;
    });

    mocha.it('constant movement with bounce', () => {
        result = calculator.calcConstantMovement(80, 100, 100, 15);
        chai.expect(result.coord).to.equal(80);
        chai.expect(result.newVelocity).to.equal(-100);
        chai.expect(result.bounce).to.be.null;

        result = calculator.calcConstantMovement(20, -100, 0, 15);
        chai.expect(result.coord).to.equal(20);
        chai.expect(result.newVelocity).to.equal(100);
        chai.expect(result.bounce).to.be.null;
    });

    mocha.it('accelerated movement without bounce', () => {
        result = calculator.calcAcceleratedMovement(50, 100, 100, 10, 1, 0.1);
        chai.expect(result.coord).to.equal(60.05);
        chai.expect(result.newVelocity).to.equal(101);
        chai.expect(result.bounce).to.be.false;

        result = calculator.calcAcceleratedMovement(50, 100, 100, 10, -1, 0.1);
        chai.expect(result.coord).to.equal(59.95);
        chai.expect(result.newVelocity).to.equal(99);
        chai.expect(result.bounce).to.be.false;

        result = calculator.calcAcceleratedMovement(50, 10, 100, 10, -1, 2);
        chai.expect(result.coord).to.equal(50);
        chai.expect(result.newVelocity).to.equal(-10);
        chai.expect(result.bounce).to.be.false;

        result = calculator.calcAcceleratedMovement(50, -10, 100, 10, 1, 2);
        chai.expect(result.coord).to.equal(50);
        chai.expect(result.newVelocity).to.equal(10);
        chai.expect(result.bounce).to.be.false;
    });

    mocha.it('accelerated movement with bounce', () => {
        result = calculator.calcAcceleratedMovement(80, 10, 100, 10, 1, 1.464);
        chai.expect(round(result.coord)).to.equal(80);
        chai.expect(round(result.newVelocity)).to.equal(-10);
        chai.expect(result.bounce).to.be.true;

        result = calculator.calcAcceleratedMovement(20, -10, 100, 10, -1, 1.464);
        chai.expect(round(result.coord)).to.equal(20);
        chai.expect(round(result.newVelocity)).to.equal(10);
        chai.expect(result.bounce).to.be.true;

        result = calculator.calcAcceleratedMovement(80, 30, 100, 10, -1, 0.7085);
        chai.expect(round(result.coord)).to.equal(80);
        chai.expect(round(result.newVelocity)).to.equal(-30);
        chai.expect(result.bounce).to.be.true;

        result = calculator.calcAcceleratedMovement(20, -30, 100, 10, 1, 0.7085);
        chai.expect(round(result.coord)).to.equal(20);
        chai.expect(round(result.newVelocity)).to.equal(30);
        chai.expect(result.bounce).to.be.true;

        result = calculator.calcAcceleratedMovement(80, 20, 100, 10, -1, 2.1);
        chai.expect(round(result.coord)).to.equal(57.12);
        chai.expect(round(result.newVelocity)).to.equal(-29.28);
        chai.expect(result.bounce).to.be.true;

        result = calculator.calcAcceleratedMovement(20, -20, 0, 10, 1, 2.1);
        chai.expect(round(result.coord)).to.equal(42.88);
        chai.expect(round(result.newVelocity)).to.equal(29.28);
        chai.expect(result.bounce).to.be.true;
    });
});