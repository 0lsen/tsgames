import {ProgressTransformerImpl} from "../../ts/ciso/impl/ProgressTransformerImpl";

const chai = require('chai');
const mocha = require('mocha');

mocha.describe('CiSo ProgressTransformer', () => {
    mocha.it('cosine transform', () => {
        const transformer = new ProgressTransformerImpl();

        chai.expect(transformer.transform(0)).to.equal(0);
        chai.expect(transformer.transform(0.25).toFixed(5)).to.equal(0.14645.toString());
        chai.expect(transformer.transform(0.5).toFixed(5)).to.equal(0.5.toFixed(5));
        chai.expect(transformer.transform(0.75).toFixed(5)).to.equal(0.85355.toString());
        chai.expect(transformer.transform(1)).to.equal(1);
    });
});