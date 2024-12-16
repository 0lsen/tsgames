import {IsometricCalcImpl} from "../../ts/peso/impl/IsometricCalcImpl";
import {Coord} from "../../ts/core/model/Coord";

const chai = require('chai');
const mocha = require('mocha');

const tileSize = 100;
const calc = new IsometricCalcImpl(new Coord(2*7*tileSize, 7*tileSize), tileSize);

mocha.describe('IsometricCalc', () => {

    mocha.it('maps tile corner to screen', () => {
        const result = calc.tileCornerToScreen(new Coord(1, 1));

        chai.expect(result.x).to.equal(700);
        chai.expect(result.y).to.equal(100);
    });

    mocha.it('maps screen to tile', () => {
        const result = calc.screenToTile(new Coord(710, 210));

        chai.expect(result.x).to.equal(2);
        chai.expect(result.y).to.equal(2);
    });
});