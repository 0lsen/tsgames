import {CoordDimensionChooserImpl} from "../../ts/canvas/impl/CoordDimensionChooserImpl";
import {Coord} from "../../ts/core/model/Coord";
import {Direction} from "../../ts/core/enum/Direction";

const chai = require('chai');
const mocha = require('mocha');

const chooser = new CoordDimensionChooserImpl();

const posX = 1;
const posY = 2;

const coord = new Coord(posX, posY);

mocha.describe('Canvas Dimension Chooser', () => {
    mocha.it('UP', () => {
        chai.expect(chooser.choose(coord, Direction.UP, true)).to.equal(posY);
        chai.expect(chooser.choose(coord, Direction.UP, false)).to.equal(posX);
    });
    mocha.it('RIGHT', () => {
        chai.expect(chooser.choose(coord, Direction.RIGHT, true)).to.equal(posX);
        chai.expect(chooser.choose(coord, Direction.RIGHT, false)).to.equal(posY);
    });
    mocha.it('DOWN', () => {
        chai.expect(chooser.choose(coord, Direction.DOWN, true)).to.equal(posY);
        chai.expect(chooser.choose(coord, Direction.DOWN, false)).to.equal(posX);
    });
    mocha.it('LEFT', () => {
        chai.expect(chooser.choose(coord, Direction.LEFT, true)).to.equal(posX);
        chai.expect(chooser.choose(coord, Direction.LEFT, false)).to.equal(posY);
    });
});