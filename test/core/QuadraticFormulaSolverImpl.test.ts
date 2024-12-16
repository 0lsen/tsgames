import {QuadraticFormulaSolverImpl} from "../../ts/core/impl/QuadraticFormulaSolverImpl";

const chai = require('chai');
const mocha = require('mocha');

const solver = new QuadraticFormulaSolverImpl();
mocha.describe('Core QuadraticFormulaSolver', () => {

    mocha.it('calculates single solution', () => {
        chai.expect(solver.solveOne(8, 4, -4)).to.equal(0.5);
    });

    mocha.it('calculates both solutions', () => {
        chai.expect(solver.solveAll(8, 4, -4)).to.deep.equal([0.5, -1]);
    });

    mocha.it('returns undefined for imaginary solutions', () => {
       chai.expect(solver.solveOne(1, 1, 1)).to.be.undefined;
       chai.expect(solver.solveAll(1, 1, 1)).to.be.undefined;
    });
});