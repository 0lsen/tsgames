import {Settings} from "../../ts/bs/Settings";

const chai = require('chai');
const mocha = require('mocha');

mocha.describe('BS Settings', () => {
    mocha.it('standard Settings', () => {
        const setup = Settings.standardSetup();
        chai.expect(setup.getShips().length).to.equal(5);
    });
});