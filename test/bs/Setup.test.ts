import {Setup} from "../../ts/bs/model/Setup";
import {ShipConfig} from "../../ts/bs/model/ShipConfig";
import {Carrier} from "../../ts/bs/model/ship/Carrier";
import {Destroyer} from "../../ts/bs/model/ship/Destroyer";
import {SetupException} from "../../ts/bs/exception/SetupException";

const chai = require('chai');
const mocha = require('mocha');

let setup: Setup;

mocha.describe('BS Setup', () => {

    mocha.it('has ships added until complete', () => {
        setup = new Setup();
        chai.expect(() => setup.addToConfig(new ShipConfig(Carrier.name, 2))).to.not.throw();

        chai.expect(setup.isComplete()).to.be.false;

        chai.expect(() => setup.checkShip(new Carrier())).to.not.throw();
        chai.expect(() => setup.addShip(new Carrier())).to.not.throw();
        chai.expect(setup.isComplete()).to.be.false;

        chai.expect(() => setup.checkShip(new Destroyer())).to.throw(SetupException);
        chai.expect(setup.isComplete()).to.be.false;

        chai.expect(() => setup.checkShip(new Carrier())).to.not.throw();
        chai.expect(() => setup.addShip(new Carrier())).to.not.throw();
        chai.expect(setup.isComplete()).to.be.true;

        chai.expect(() => setup.checkShip(new Carrier())).to.throw(SetupException);
        chai.expect(setup.isComplete()).to.be.true;
    });

    mocha.it('gets ships correctly', () => {
        setup = new Setup();
        chai.expect(() => setup.addToConfig(new ShipConfig(Carrier.name, 1))).to.not.throw();
        chai.expect(() => setup.addToConfig(new ShipConfig(Destroyer.name, 2))).to.not.throw();

        let ships = setup.getShips();

        chai.expect(ships.length).to.equal(3);
        chai.expect(ships.filter(s => s.constructor.name === Carrier.name).length).to.equal(1);
        chai.expect(ships.filter(s => s.constructor.name === Destroyer.name).length).to.equal(2);
    });
});