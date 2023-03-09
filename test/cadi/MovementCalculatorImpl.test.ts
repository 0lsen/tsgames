import {MovementCalculatorImpl} from "../../ts/cadi/impl/MovementCalculatorImpl";
import {QuadraticFormulaSolverImpl} from "../../ts/cadi/impl/QuadraticFormulaSolverImpl";

const chai = require('chai');
const mocha = require('mocha');

const radius = 10;
const calculator = new MovementCalculatorImpl(new QuadraticFormulaSolverImpl());

mocha.describe('Canvas Movement Calc', () => {
    mocha.it('TODO', () => {
    });
});