import {StalinSort} from "../../ts/ciso/impl/StalinSort";
import {MoveMode} from "../../ts/ciso/enum/MoveMode";

const chai = require('chai');
const mocha = require('mocha');

mocha.describe('CiSo StalinSort', () => {
    mocha.it('purges the not aligned', () => {
        const sort = new StalinSort([4, 5, 3, 6, 1, 2]);

        chai.expect(sort.getValues()).to.deep.equal([4, 5, 3, 6, 1, 2]);

        sort.iterate();
        chai.expect(sort.getValues()).to.deep.equal([4, 5, 6, 1, 2, 3]);
        chai.expect(sort.movingFrom()).to.equal(2);
        chai.expect(sort.movingTo()).to.equal(5);
        chai.expect(sort.moveMode()).to.equal(MoveMode.ELIMINATE);
        chai.expect(sort.isSorted()).to.be.false;

        sort.iterate();
        chai.expect(sort.getValues()).to.deep.equal([4, 5, 6, 2, 0, 1]);
        chai.expect(sort.movingFrom()).to.equal(3);
        chai.expect(sort.movingTo()).to.equal(5);
        chai.expect(sort.moveMode()).to.equal(MoveMode.ELIMINATE);
        chai.expect(sort.isSorted()).to.be.false;

        sort.iterate();
        chai.expect(sort.getValues()).to.deep.equal([4, 5, 6, 0, 0, 2]);
        chai.expect(sort.movingFrom()).to.equal(3);
        chai.expect(sort.movingTo()).to.equal(5);
        chai.expect(sort.moveMode()).to.equal(MoveMode.ELIMINATE);
        chai.expect(sort.isSorted()).to.be.false;

        sort.iterate();
        chai.expect(sort.getValues()).to.deep.equal([4, 5, 6, 0, 0, 0]);
        chai.expect(sort.movingFrom()).to.be.undefined;
        chai.expect(sort.movingTo()).to.be.undefined;
        chai.expect(sort.isSorted()).to.be.true;
    });

    mocha.it('animates last element purge', () => {
        const sort = new StalinSort([2, 1]);

        chai.expect(sort.getValues()).to.deep.equal([2, 1]);
        sort.iterate();

        chai.expect(sort.movingFrom()).to.equal(1);
        chai.expect(sort.movingTo()).to.equal(1);
        chai.expect(sort.moveMode()).to.equal(MoveMode.ELIMINATE);
        chai.expect(sort.isSorted()).to.be.false;
    });
});