import {RandomizerImpl} from "../../ts/core/impl/RandomizerImpl";
import {Orientation} from "../../ts/core/enum/Orientation";

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
            if (hits.find(bool => !bool) === undefined) break;
        }
        chai.expect(hits).to.not.contain(false);
    });

    mocha.it('generates random integer between', () => {
        let max = 3;
        let min = -2;
        let hits = new Array(max-min).fill(false);
        let expected = new Array(max-min);
        for (let i=0; i < max-min; i++) {
            expected[i] = i;
        }
        for (let i=0; i < numberOfTries; i++) {
            let int = randomizer.randomIntBetween(min, max);
            chai.expect(int-min).to.be.oneOf(expected);
            hits[int-min] = true;
            if (hits.find(bool => !bool) === undefined) break;
        }
    });

    mocha.it('generates random boolean', () => {
        let hits = new Array(2).fill(false);
        for (let i=0; i < numberOfTries; i++) {
            let bool = randomizer.randomBool();
            chai.expect(bool).to.be.oneOf([false, true]);
            hits[+bool] = true;
            if (hits.find(bool => !bool) === undefined) break;
        }
        chai.expect(hits).to.not.contain(false);
    });

    mocha.it('generates random enum key', () => {
        let hits = new Array(2).fill(false);
        for (let i=0; i < numberOfTries; i++) {
            let direction = randomizer.randomEnum(Orientation);
            chai.expect(direction).to.be.oneOf([0,1]);
            hits[direction] = true;
            if (hits.find(bool => !bool) === undefined) break;
        }
        chai.expect(hits).to.not.contain(false);
    });

    mocha.it('gerantes random gaussian', () => {
        chai.expect(typeof randomizer.randomGaussian()).to.equal("number");
    });

    mocha.it('chooses random list entry', () => {
        let list = ['a', 'b', 'c'];
        let hits = new Map<string, boolean>([['a', false],['b', false],['c', false]]);
        for (let i=0; i < numberOfTries; i++) {
            let entry = randomizer.randomListEntry(list);
            chai.expect(entry).to.be.oneOf(list);
            hits.set(entry, true);
            if (Array.from(hits.values()).find(bool => !bool) === undefined) break;
        }
        chai.expect(Array.from(hits.values())).to.not.contain(false);

        chai.expect(() => randomizer.randomListEntry([])).to.throw();
    });
});