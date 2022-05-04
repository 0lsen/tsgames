import {RandomOpponent} from "../../ts/bs/impl/opponent/RandomOpponent";
import {Setup} from "../../ts/bs/model/Setup";
import {ShipConfig} from "../../ts/bs/model/ShipConfig";
import {Carrier} from "../../ts/bs/model/ship/Carrier";
import {BoardImpl} from "../../ts/bs/impl/BoardImpl";
import {Destroyer} from "../../ts/bs/model/ship/Destroyer";
import {RandomizerMock} from "../core/RandomizerMock";
import {ShipArrangement} from "../../ts/bs/model/ShipArrangement";
import {Orientation} from "../../ts/core/enum/Orientation";
import {Coord} from "../../ts/bs/model/Coord";
import {Shot} from "../../ts/bs/model/Shot";

const chai = require('chai');
const mocha = require('mocha');

const randomizer = new RandomizerMock(
    [1,1,2,1,3,1,1,1,2,2],
    [],
    [1,1,1]
);

const opponent = new RandomOpponent(randomizer);

mocha.describe('BS RandomOpponent', () => {
    const setup = new Setup();
    setup.addToConfig(new ShipConfig(Carrier.name, 1));
    setup.addToConfig(new ShipConfig(Destroyer.name, 2));

    mocha.it('places ships', () => {
        let opponentBoard = new BoardImpl();
        chai.expect(() => opponent.placeShipsOn(opponentBoard, setup)).to.not.throw();
        chai.expect(opponentBoard.getShips().length).to.equal(3);
    });

    mocha.it('shoots', () => {
        let playerBoard = new BoardImpl();
        playerBoard.addShip(new ShipArrangement(new Carrier(), new Coord(1, 1, Orientation.VERTICAL)));

        let shotHit = new Shot();
        let shotMissed = new Shot();

        chai.expect(() => opponent.shootAt(playerBoard, shotHit, setup)).to.not.throw();
        chai.expect(shotHit.hit).to.be.true;

        chai.expect(() => opponent.shootAt(playerBoard, shotMissed, setup)).to.not.throw();
        chai.expect(shotMissed.hit).to.be.false;
    });

    mocha.it('called randomizer as expected', () => {
        chai.expect(() => randomizer.verify()).to.not.throw();
    });
});