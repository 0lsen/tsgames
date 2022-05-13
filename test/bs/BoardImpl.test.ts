import {BoardImpl} from "../../ts/bs/impl/BoardImpl";
import {ShipArrangement} from "../../ts/bs/model/ShipArrangement";
import {Carrier} from "../../ts/bs/model/ship/Carrier";
import {Coord} from "../../ts/bs/model/Coord";
import {Orientation} from "../../ts/core/enum/Orientation";
import {OutOfBoundsException} from "../../ts/core/exception/OutOfBoundsException";
import {Destroyer} from "../../ts/bs/model/ship/Destroyer";
import {CollisionException} from "../../ts/bs/exception/CollisionException";
import {DoubleTapException} from "../../ts/bs/exception/DoubleTapException";
import {Patrol} from "../../ts/bs/model/ship/Patrol";

const chai = require('chai');
const mocha = require('mocha');

let board: BoardImpl;

mocha.describe('BS Board', () => {

    mocha.it('checks vertical bounds', () => {
        board = new BoardImpl();

        chai.expect(() => board.addShip(new ShipArrangement(new Carrier(), new Coord(0, 0, Orientation.VERTICAL)))).to.not.throw();
        chai.expect(() => board.addShip(new ShipArrangement(new Carrier(), new Coord(0, 5, Orientation.VERTICAL)))).to.not.throw();
        chai.expect(() => board.addShip(new ShipArrangement(new Carrier(), new Coord(9, 0, Orientation.VERTICAL)))).to.not.throw();

        chai.expect(() => board.addShip(new ShipArrangement(new Carrier(), new Coord(0, 6, Orientation.VERTICAL)))).to.throw(OutOfBoundsException);
        chai.expect(() => board.addShip(new ShipArrangement(new Carrier(), new Coord(0, -1, Orientation.VERTICAL)))).to.throw(OutOfBoundsException);
    });

    mocha.it('checks horizontal bounds', () => {
        board = new BoardImpl();

        chai.expect(() => board.addShip(new ShipArrangement(new Carrier(), new Coord(0, 0, Orientation.HORIZONTAL)))).to.not.throw();
        chai.expect(() => board.addShip(new ShipArrangement(new Carrier(), new Coord(5, 0, Orientation.HORIZONTAL)))).to.not.throw();
        chai.expect(() => board.addShip(new ShipArrangement(new Carrier(), new Coord(0, 9, Orientation.HORIZONTAL)))).to.not.throw();

        chai.expect(() => board.addShip(new ShipArrangement(new Carrier(), new Coord(6, 0, Orientation.HORIZONTAL)))).to.throw(OutOfBoundsException);
        chai.expect(() => board.addShip(new ShipArrangement(new Carrier(), new Coord(-1, 0, Orientation.HORIZONTAL)))).to.throw(OutOfBoundsException);
    });

    mocha.it('checks collision', () => {
        board = new BoardImpl();

        chai.expect(() => board.addShip(new ShipArrangement(new Carrier(), new Coord(4, 0, Orientation.VERTICAL)))).to.not.throw();
        chai.expect(() => board.addShip(new ShipArrangement(new Destroyer(), new Coord(3, 0, Orientation.VERTICAL)))).to.not.throw();

        chai.expect(() => board.addShip(new ShipArrangement(new Destroyer(), new Coord(4, 0, Orientation.VERTICAL)))).to.throw(CollisionException);
        chai.expect(() => board.addShip(new ShipArrangement(new Destroyer(), new Coord(4, 1, Orientation.VERTICAL)))).to.throw(CollisionException);
        chai.expect(() => board.addShip(new ShipArrangement(new Destroyer(), new Coord(4, 4, Orientation.VERTICAL)))).to.throw(CollisionException);

        chai.expect(() => board.addShip(new ShipArrangement(new Destroyer(), new Coord(4, 5, Orientation.VERTICAL)))).to.not.throw();

        chai.expect(() => board.addShip(new ShipArrangement(new Destroyer(), new Coord(3, 7, Orientation.HORIZONTAL)))).to.throw(CollisionException);

        chai.expect(() => board.addShip(new ShipArrangement(new Destroyer(), new Coord(3, 8, Orientation.HORIZONTAL)))).to.not.throw();

        chai.expect(() => board.addShip(new ShipArrangement(new Destroyer(), new Coord(1, 2, Orientation.HORIZONTAL)))).to.throw(CollisionException);

        chai.expect(() => board.addShip(new ShipArrangement(new Destroyer(), new Coord(1, 3, Orientation.HORIZONTAL)))).to.not.throw();
    });

    let assertShot = function(x: number, y: number, hit: boolean, expectedException : (new () => Error) | null) {
        if (expectedException != null) {
            chai.expect(() => board.shoot(x, y)).to.throw(expectedException);
        } else {
            chai.expect(board.shoot(x, y)).to.equal(hit);
        }
    };

    mocha.it('takes shots', () => {
        board = new BoardImpl();

        board.addShip(new ShipArrangement(new Carrier(), new Coord(0,1, Orientation.VERTICAL)));

        assertShot(0, 1, true, null);
        assertShot(0, 3, true, null);
        assertShot(0, 5, true, null);
        assertShot(0, 0, false, null);
        assertShot(0, 6, false, null);
        assertShot(1, 1, false, null);

        assertShot(0, 0, false, DoubleTapException);
        assertShot(0, 1, false, DoubleTapException);

        assertShot(-1, 0, false, OutOfBoundsException);
        assertShot(0, -1, false, OutOfBoundsException);
        assertShot(10, 0, false, OutOfBoundsException);
        assertShot(0, 10, false, OutOfBoundsException);
    });

    mocha.it('sinks ship', () => {
        board = new BoardImpl();

        let ship = new Destroyer();
        chai.expect(() => board.addShip(new ShipArrangement(ship, new Coord(1,1, Orientation.HORIZONTAL)))).to.not.throw();

        chai.expect(ship.isSunk()).to.be.false;
        assertShot(0, 0, false, null);
        chai.expect(ship.isSunk()).to.be.false;
        assertShot(1, 1, true, null);
        chai.expect(ship.isSunk()).to.be.false;
        assertShot(2, 1, true, null);
        chai.expect(ship.isSunk()).to.be.false;
        assertShot(3, 1, true, null);
        chai.expect(ship.isSunk()).to.be.true;
    });

    mocha.it('beats player', () => {
        board = new BoardImpl();

        let ship1 = new Carrier();
        let ship2 = new Destroyer();

        chai.expect(board.isBeaten()).to.be.true;
        chai.expect(() => board.addShip(new ShipArrangement(ship1, new Coord(1, 1, Orientation.VERTICAL)))).to.not.throw();
        chai.expect(() => board.addShip(new ShipArrangement(ship2, new Coord(2, 2, Orientation.VERTICAL)))).to.not.throw();
        chai.expect(board.isBeaten()).to.be.false;
        ship1.sink();
        chai.expect(board.isBeaten()).to.be.false;
        ship2.sink();
        chai.expect(board.isBeaten()).to.be.true;
    });

    mocha.it('constructs correct new instance', () => {
        board = new BoardImpl();

        chai.expect(() => board.addShip(new ShipArrangement(new Carrier(), new Coord(0,0, Orientation.VERTICAL)))).to.not.throw();
        chai.expect(() => board.addShip(new ShipArrangement(new Patrol(), new Coord(1,1, Orientation.VERTICAL)))).to.not.throw();
        assertShot(1, 1, true, null);
        assertShot(1, 2, true, null);

        let copy = new BoardImpl(board);

        chai.expect(copy.getShips().length).to.equal(1);
        chai.expect(copy.getShips()[0].ship).to.be.instanceOf(Patrol);
        chai.expect(copy.getHitMap()).to.equal(board.getHitMap());
    });
});