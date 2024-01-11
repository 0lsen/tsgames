import {ProgressTransformerImpl} from "../../ts/ciso/impl/ProgressTransformerImpl";

const chai = require('chai');
const mocha = require('mocha');

const transformer = new ProgressTransformerImpl();

mocha.describe('CiSo ProgressTransformer', () => {
    mocha.it('cosine transform', () => {
        chai.expect(transformer.transform(0)).to.equal(0);
        chai.expect(transformer.transform(0.25).toFixed(5)).to.equal(0.14645.toString());
        chai.expect(transformer.transform(0.5).toFixed(5)).to.equal(0.5.toFixed(5));
        chai.expect(transformer.transform(0.75).toFixed(5)).to.equal(0.85355.toString());
        chai.expect(transformer.transform(1)).to.equal(1);
    });

    mocha.it('transition phase', () => {
        const transitionPhase = 0.2;
        chai.expect(transformer.transform(0, transitionPhase)).to.equal(0);
        chai.expect(transformer.transform(0.1, transitionPhase)).to.equal(0);
        chai.expect(transformer.transform(0.2, transitionPhase)).to.equal(0);

        chai.expect(transformer.transform(0.35, transitionPhase).toFixed(5)).to.equal(0.14645.toString());
        chai.expect(transformer.transform(0.5, transitionPhase).toFixed(5)).to.equal(0.5.toFixed(5));
        chai.expect(transformer.transform(0.65, transitionPhase).toFixed(5)).to.equal(0.85355.toString());

        chai.expect(transformer.transform(0.8, transitionPhase)).to.equal(1);
        chai.expect(transformer.transform(0.9, transitionPhase)).to.equal(1);
        chai.expect(transformer.transform(1, transitionPhase)).to.equal(1);
    });
});