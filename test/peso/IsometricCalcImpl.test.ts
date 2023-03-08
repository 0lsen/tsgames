import {IsometricCalcImpl} from "../../ts/peso/impl/IsometricCalcImpl";
import {Coord} from "../../ts/core/model/Coord";

const chai = require('chai');
const mocha = require('mocha');

const tileSize = 100;
const calc = new IsometricCalcImpl(new Coord(2*7*tileSize, 7*tileSize), tileSize);

mocha.describe('IsometricCalc', () => {
    mocha.it('TODO', () => {

    });
});