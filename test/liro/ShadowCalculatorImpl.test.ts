import {ShadowCalculatorImpl} from "../../ts/liro/impl/ShadowCalculatorImpl";
import {Coord} from "../../ts/core/model/Coord";
import {CanvasBall} from "../../ts/canvas/model/CanvasBall";

const chai = require('chai');
const mocha = require('mocha');

const dimensions = new Coord(200, 100);
const lightSource = new CanvasBall(100, 50, 10);
const calc = new ShadowCalculatorImpl(dimensions, lightSource);

mocha.describe('ShadowCalculator', () => {
    mocha.it('TODO', () => {

    });
});