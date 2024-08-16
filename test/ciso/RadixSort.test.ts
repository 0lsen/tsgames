import {RadixSort} from "../../ts/ciso/impl/RadixSort";
import {SortTest} from "./SortTest";

const chai = require('chai');
const mocha = require('mocha');

const sortTest = new SortTest(RadixSort);
sortTest.runTests(undefined);

mocha.describe('CiSo RadixSort', () => {
    mocha.it('value movement example', () => {
        const sort = new RadixSort([23, 87, 3, 7, 240, 50]);

        chai.expect(sort.getValues()).to.deep.equal([23, 87, 3, 7, 240, 50]);

        sort.iterate();
        chai.expect(sort.getValues()).to.deep.equal([23, 3, 87, 7, 240, 50]);
        chai.expect(sort.movingFrom()).to.equal(2);
        chai.expect(sort.movingTo()).to.equal(1);

        sort.iterate();
        chai.expect(sort.getValues()).to.deep.equal([240, 23, 3, 87, 7, 50]);
        chai.expect(sort.movingFrom()).to.equal(4);
        chai.expect(sort.movingTo()).to.equal(0);

        sort.iterate();
        chai.expect(sort.getValues()).to.deep.equal([240, 50, 23, 3, 87, 7]);
        chai.expect(sort.movingFrom()).to.equal(5);
        chai.expect(sort.movingTo()).to.equal(1);

        sort.iterate();
        chai.expect(sort.getValues()).to.deep.equal([23, 240, 50, 3, 87, 7]);
        chai.expect(sort.movingFrom()).to.equal(2);
        chai.expect(sort.movingTo()).to.equal(0);

        sort.iterate();
        chai.expect(sort.getValues()).to.deep.equal([3, 23, 240, 50, 87, 7]);
        chai.expect(sort.movingFrom()).to.equal(3);
        chai.expect(sort.movingTo()).to.equal(0);

        sort.iterate();
        chai.expect(sort.getValues()).to.deep.equal([3, 7, 23, 240, 50, 87]);
        chai.expect(sort.movingFrom()).to.equal(5);
        chai.expect(sort.movingTo()).to.equal(1);

        sort.iterate();
        chai.expect(sort.getValues()).to.deep.equal([3, 7, 23, 50, 240, 87]);
        chai.expect(sort.movingFrom()).to.equal(4);
        chai.expect(sort.movingTo()).to.equal(3);

        sort.iterate();
        chai.expect(sort.getValues()).to.deep.equal([3, 7, 23, 50, 87, 240]);
        chai.expect(sort.movingFrom()).to.equal(5);
        chai.expect(sort.movingTo()).to.equal(4);
        chai.expect(sort.isSorted()).to.be.true;
    });
});