import {BogoSort} from "../../ts/ciso/impl/BogoSort";
import {RandomizerMock} from "../core/RandomizerMock";

const chai = require('chai');
const mocha = require('mocha');

mocha.describe('CiSo BogoSort', () => {
    mocha.it('sorts', () => {
        const sort = new BogoSort([3, 1, 2]);
        const randomizer = new RandomizerMock();
        randomizer.intReturns = [-1, 1, 1, 1, -1, -1, 1];
        BogoSort.randomizer = randomizer;

        chai.expect(sort.getValues()).to.deep.equal([3, 1, 2]);
        chai.expect(sort.isSorted()).to.be.false;

        sort.iterate();
        chai.expect(sort.getValues()).to.deep.equal([1, 3, 2]);
        chai.expect(sort.isSorted()).to.be.false;

        sort.iterate();
        chai.expect(sort.getValues()).to.deep.equal([1, 2, 3]);
        chai.expect(sort.isSorted()).to.be.true;

        randomizer.verify();
    });
});