import {RandomizerImpl} from "../../ts/core/impl/RandomizerImpl";
import {Orientation} from "../../ts/bs/enum/Orientation";

const chai = require('chai');
const mocha = require('mocha');

const numberOfTries = 1000;
const randomizer = new RandomizerImpl();

// TODO: theoretically these can randomly fail
mocha.describe('Core Randomizer', () => {
    mocha.it('generates random integer', () => {
        let max = 5;
        let hits = new Array(max).fill(false);
        let expected = new Array(max);
        for (let i=0; i < max; i++) {
            expected[i] = i;
        }
        for (let i=0; i < numberOfTries; i++) {
            let int = randomizer.randomInt(max);
            chai.expect(int).to.be.oneOf(expected);
            hits[int] = true;
        }
        chai.expect(hits).to.not.contain(false);
    });

    mocha.it('generates random boolean', () => {
        let hits = new Array(2).fill(false);
        for (let i=0; i < numberOfTries; i++) {
            let bool = randomizer.randomBool();
            chai.expect(bool).to.be.oneOf([false, true]);
            hits[+bool] = true;
        }
        chai.expect(hits).to.not.contain(false);
    });

    mocha.it('generates random enum key', () => {
        let hits = new Array(2).fill(false);
        for (let i=0; i < numberOfTries; i++) {
            let direction = randomizer.randomEnum(Orientation);
            chai.expect(direction).to.be.oneOf([0,1]);
            hits[direction] = true;
        }
        chai.expect(hits).to.not.contain(false);
    });
});