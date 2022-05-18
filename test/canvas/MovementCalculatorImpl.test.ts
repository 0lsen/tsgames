import {MovementCalculatorImpl} from "../../ts/canvas/impl/MovementCalculatorImpl";
import {QuadraticFormulaSolverImpl} from "../../ts/canvas/impl/QuadraticFormulaSolverImpl";

const chai = require('chai');
const mocha = require('mocha');

const radius = 10;
const calculator = new MovementCalculatorImpl(new QuadraticFormulaSolverImpl());

mocha.describe('Canvas Movement Calc', () => {
    mocha.it('TODO', () => {
    });
});