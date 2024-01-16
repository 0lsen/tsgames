import {MergeSort} from "../../ts/ciso/impl/MergeSort";
import {SortTest} from "./SortTest";

const chai = require('chai');
const mocha = require('mocha');

const sortTest = new SortTest(MergeSort);
sortTest.runTests(undefined);

mocha.describe('CiSo MergeSort', () => {
   mocha.it('value movement', () => {
       const sort = new MergeSort([8, 7, 5, 6, 3, 4, 2, 1]);

       chai.expect(sort.getValues()).to.deep.equal([8, 7, 5, 6, 3, 4, 2, 1]);
       chai.expect(sort.movingFrom()).to.be.undefined;
       chai.expect(sort.movingTo()).to.be.undefined;

       sort.iterate();
       chai.expect(sort.getValues()).to.deep.equal([7, 8, 5, 6, 3, 4, 2, 1]);
       chai.expect(sort.movingFrom()).to.equal(1);
       chai.expect(sort.movingTo()).to.equal(0);

       sort.iterate();
       chai.expect(sort.getValues()).to.deep.equal([7, 8, 5, 6, 3, 4, 2, 1]);
       chai.expect(sort.movingFrom()).to.be.undefined;
       chai.expect(sort.movingTo()).to.be.undefined;

       sort.iterate();
       chai.expect(sort.getValues()).to.deep.equal([7, 8, 5, 6, 3, 4, 2, 1]);
       chai.expect(sort.movingFrom()).to.be.undefined;
       chai.expect(sort.movingTo()).to.be.undefined;

       sort.iterate();
       chai.expect(sort.getValues()).to.deep.equal([7, 8, 5, 6, 3, 4, 1, 2]);
       chai.expect(sort.movingFrom()).to.equal(7);
       chai.expect(sort.movingTo()).to.equal(6);

       sort.iterate();
       chai.expect(sort.getValues()).to.deep.equal([7, 8, 5, 6, 3, 4, 1, 2]);
       chai.expect(sort.movingFrom()).to.be.undefined;
       chai.expect(sort.movingTo()).to.be.undefined;

       sort.iterate();
       chai.expect(sort.getValues()).to.deep.equal([5, 7, 8, 6, 3, 4, 1, 2]);
       chai.expect(sort.movingFrom()).to.equal(2);
       chai.expect(sort.movingTo()).to.equal(0);

       sort.iterate();
       chai.expect(sort.getValues()).to.deep.equal([5, 6, 7, 8, 3, 4, 1, 2]);
       chai.expect(sort.movingFrom()).to.equal(3);
       chai.expect(sort.movingTo()).to.equal(1);

       sort.iterate();
       chai.expect(sort.getValues()).to.deep.equal([5, 6, 7, 8, 3, 4, 1, 2]);
       chai.expect(sort.movingFrom()).to.be.undefined;
       chai.expect(sort.movingTo()).to.be.undefined;

       sort.iterate();
       chai.expect(sort.getValues()).to.deep.equal([5, 6, 7, 8, 1, 3, 4, 2]);
       chai.expect(sort.movingFrom()).to.equal(6);
       chai.expect(sort.movingTo()).to.equal(4);

       sort.iterate();
       chai.expect(sort.getValues()).to.deep.equal([5, 6, 7, 8, 1, 2, 3, 4]);
       chai.expect(sort.movingFrom()).to.equal(7);
       chai.expect(sort.movingTo()).to.equal(5);
   });
});