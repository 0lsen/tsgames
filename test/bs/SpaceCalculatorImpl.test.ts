import {SpaceCalculatorImpl} from "../../ts/bs/impl/SpaceCalculatorImpl";
import {Orientation} from "../../ts/core/enum/Orientation";
import {HitMapBuilder} from "./HitMapBuilder";

const chai = require('chai');
const mocha = require('mocha');

const maxLength = 5;
const calculator = new SpaceCalculatorImpl();

let hitmap = HitMapBuilder.build();

mocha.describe('BS SpaceCalculator', () => {
    let freeMap = calculator.buildFreeMap(hitmap);

    mocha.it('builds free map', () => {
        chai.expect(freeMap).to.deep.equal([
            [true, true, true, true, true, true, true, true, true, true],
            [true, true, true, true, true, true, false, true, true, true],
            [true, true, true, true, true, false, true, false, true, true],
            [true, true, true, true, true, true, false, true, true, true],
            [true, true, true, true, true, true, true, true, false, true],
            [true, true, true, true, true, true, true, true, true, true],
            [true, false, true, true, true, true, false, true, true, true],
            [true, false, true, true, true, true, true, true, true, false],
            [true, true, true, true, true, true, true, true, true, true],
            [true, true, true, true, true, true, true, true, true, true],
        ]);
    });

    mocha.it('calculates examples correctly', () => {
        let calcSpace = function (x: number, y: number) {
            let horizontal = calculator.calculateSpace(x, y, Orientation.HORIZONTAL, maxLength, freeMap);
            let vertical = calculator.calculateSpace(x, y, Orientation.VERTICAL, maxLength, freeMap);
            return [horizontal, vertical];
        };

        chai.expect(calcSpace(0,0)).to.deep.equal([5,5]);
        chai.expect(calcSpace(5,4)).to.deep.equal([9,9]);
        chai.expect(calcSpace(6,4)).to.deep.equal([8,4]);
        chai.expect(calcSpace(7,2)).to.deep.equal([7,5]);
        chai.expect(calcSpace(4,9)).to.deep.equal([7,1]);
        chai.expect(calcSpace(8,9)).to.deep.equal([2,5]);
        chai.expect(calcSpace(6,8)).to.deep.equal([5,3]);
        chai.expect(calcSpace(2,6)).to.deep.equal([1,1]);
    });
});