import {QuickSort} from "../../ts/ciso/impl/QuickSort";
import {SortTest} from "./SortTest";

const chai = require('chai');
const mocha = require('mocha');

const sortTest = new SortTest(QuickSort);
sortTest.runTests(undefined);

mocha.describe('CiSo QuickSort', () => {
    mocha.it('value movement', () => {
        const sort = new QuickSort(([4, 5, 3, 6, 1, 2]));

        chai.expect(sort.getValues()).to.deep.equal([4, 5, 3, 6, 1, 2]);

        sort.iterate();
        chai.expect(sort.getValues()).to.deep.equal([1, 4, 5, 3, 6, 2]);
        chai.expect(sort.movingFrom()).to.equal(4);
        chai.expect(sort.movingTo()).to.equal(0);

        sort.iterate();
        chai.expect(sort.getValues()).to.deep.equal([1, 2, 4, 5, 3, 6]);
        chai.expect(sort.movingFrom()).to.equal(5);
        chai.expect(sort.movingTo()).to.equal(1);

        sort.iterate();
        chai.expect(sort.getValues()).to.deep.equal([1, 2, 3, 4, 5, 6]);
        chai.expect(sort.movingFrom()).to.equal(4);
        chai.expect(sort.movingTo()).to.equal(2);
        chai.expect(sort.isSorted()).to.be.false;

        sort.iterate();
        chai.expect(sort.isSorted()).to.be.true;
    });
});