import {RandomizerMock} from "../core/RandomizerMock";
import {ProbabilityBasedOpponent} from "../../ts/bs/impl/opponent/ProbabilityBasedOpponent";
import {HeatMapperImpl} from "../../ts/bs/impl/HeatMapperImpl";
import {SpaceCalculatorImpl} from "../../ts/bs/impl/SpaceCalculatorImpl";
import {Setup} from "../../ts/bs/model/Setup";
import {ShipConfig} from "../../ts/bs/model/ShipConfig";
import {Carrier} from "../../ts/bs/model/ship/Carrier";
import {Destroyer} from "../../ts/bs/model/ship/Destroyer";
import {BoardImpl} from "../../ts/bs/impl/BoardImpl";
import {ShipArrangement} from "../../ts/bs/model/ShipArrangement";
import {Coord} from "../../ts/bs/model/Coord";
import {Orientation} from "../../ts/core/enum/Orientation";
import {Shot} from "../../ts/bs/model/Shot";

const chai = require('chai');
const mocha = require('mocha');

const randomizer = new RandomizerMock();

const spaceCalc = new SpaceCalculatorImpl();
const opponent = new ProbabilityBasedOpponent(randomizer, new HeatMapperImpl(spaceCalc), spaceCalc);

mocha.describe('BS ProbabilityBasedOpponent', () => {
    const setup = new Setup();
    setup.addToConfig(new ShipConfig(Carrier.name, 1));
    setup.addToConfig(new ShipConfig(Destroyer.name, 2));

    mocha.it('shoots', () => {
        randomizer.intReturns = [5000, 830];
        randomizer.enumReturns = [Orientation.HORIZONTAL, Orientation.HORIZONTAL, Orientation.HORIZONTAL, Orientation.HORIZONTAL];
        randomizer.boolReturns = [false, false, false, false, true, false, false];

        const playerBoard = new BoardImpl();
        playerBoard.addShip(new ShipArrangement(new Carrier(), new Coord(1, 1, Orientation.VERTICAL)));

        const shotMissed1 = new Shot();
        const shotMissed2 = new Shot();
        const shotMissed3 = new Shot();
        const shotMissed4 = new Shot();
        const shotHit1 = new Shot();
        const shotHit2 = new Shot();
        const shotHit3 = new Shot();

        opponent.shootAt(playerBoard, shotMissed1, setup);
        chai.expect(shotMissed1.hit).to.be.false;

        opponent.shootAt(playerBoard, shotHit1, setup);
        chai.expect(shotHit1.hit).to.be.true;

        opponent.shootAt(playerBoard, shotMissed2, setup);
        chai.expect(shotMissed2.hit).to.be.false;

        opponent.shootAt(playerBoard, shotMissed3, setup);
        chai.expect(shotMissed3.hit).to.be.false;

        opponent.shootAt(playerBoard, shotMissed4, setup);
        chai.expect(shotMissed4.hit).to.be.false;

        opponent.shootAt(playerBoard, shotHit2, setup);
        chai.expect(shotHit2.hit).to.be.true;

        opponent.shootAt(playerBoard, shotHit3, setup);
        chai.expect(shotHit3.hit).to.be.true;

        randomizer.verify();
    });
});