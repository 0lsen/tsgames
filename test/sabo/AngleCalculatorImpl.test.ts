import {AngleCalculator} from "../../ts/sabo/interface/AngleCalculator";
import {AngleCalculatorImpl} from "../../ts/sabo/impl/AngleCalculatorImpl";

const chai = require('chai');
const mocha = require('mocha');

const width = 10;
const profile = Array(width).fill(0);
const calculator = new AngleCalculatorImpl(width, profile);

mocha.describe('AngleCalculator', () => {
    calculator.setAngleOfRepose(45);
    mocha.it('TODO', () => {

    });
});

const round = (n : number|undefined) => n === undefined ? undefined : Math.round(n*1000)/1000;
