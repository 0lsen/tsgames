import {SortTest} from "./SortTest";
import {HeapSort} from "../../ts/ciso/impl/HeapSort";

const chai = require('chai');
const mocha = require('mocha');

const sortTest = new SortTest(HeapSort);
sortTest.runTests(undefined);

mocha.describe('CiSo HeapSort', () => {
    mocha.it('value movement example', () => {
        const sort = new HeapSort([4, 5, 3, 6, 1, 2]);

        chai.expect(sort.getValues()).to.deep.equal([4, 5, 3, 6, 1, 2]);

        sort.iterate();
        chai.expect(sort.getValues()).to.deep.equal([4, 6, 5, 3, 1, 2]);
        chai.expect(sort.movingFrom()).to.equal(3);
        chai.expect(sort.movingTo()).to.equal(1);

        sort.iterate();
        chai.expect(sort.getValues()).to.deep.equal([4, 6, 3, 5, 1, 2]);
        chai.expect(sort.movingFrom()).to.equal(2);
        chai.expect(sort.movingTo()).to.equal(3);

        sort.iterate();
        chai.expect(sort.getValues()).to.deep.equal([6, 4, 3, 5, 1, 2]);
        chai.expect(sort.movingFrom()).to.equal(1);
        chai.expect(sort.movingTo()).to.equal(0);

        sort.iterate();
        chai.expect(sort.getValues()).to.deep.equal([6, 5, 4, 3, 1, 2]);
        chai.expect(sort.movingFrom()).to.equal(3);
        chai.expect(sort.movingTo()).to.equal(1);

        sort.iterate();
        chai.expect(sort.getValues()).to.deep.equal([6, 5, 3, 4, 1, 2]);
        chai.expect(sort.movingFrom()).to.equal(2);
        chai.expect(sort.movingTo()).to.equal(3);

        sort.iterate();
        chai.expect(sort.getValues()).to.deep.equal([5, 3, 4, 1, 2, 6]);
        chai.expect(sort.movingFrom()).to.equal(0);
        chai.expect(sort.movingTo()).to.equal(5);

        // ...
    });
});