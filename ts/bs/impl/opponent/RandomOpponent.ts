import {Opponent} from "../../interface/Opponent";
import {Board} from "../../interface/Board";
import {Setup} from "../../model/Setup";
import {Shot} from "../../model/Shot";
import {IShip} from "../../interface/IShip";
import {Coord} from "../../model/Coord";
import {Randomizer} from "../../../core/interface/Randomizer";
import {Settings} from "../../Settings";
import {Orientation} from "../../../core/enum/Orientation";
import {ShipArrangement} from "../../model/ShipArrangement";

export class RandomOpponent implements Opponent {

    private randomizer: Randomizer;

    constructor(randomizer: Randomizer) {
        this.randomizer = randomizer;
    }

    placeShipsOn(board: Board, setup: Setup): void {
        setup.getShips().forEach(s => this.placeShip(s, board))
    }

    shootAt(board: Board, shot: Shot, setup: Setup): void {
        let success = false;
        do {
            try {
                shot.x = this.randomizer.randomInt(Settings.boardSize);
                shot.y = this.randomizer.randomInt(Settings.boardSize);
                shot.hit = board.shoot(shot.x, shot.y);
                success = true;
            } catch (e) {}
        } while (!success)
    }

    private placeShip(ship: IShip, board: Board): void {
    let success = false;
        let coord = new Coord();
        do {
            try {
                do {
                    coord.x = this.randomizer.randomInt(Settings.boardSize);
                    coord.y = this.randomizer.randomInt(Settings.boardSize);
                } while (coord.x+ship.size() > Settings.boardSize && coord.y+ship.size() > Settings.boardSize);

                coord.o =
                    coord.x+ship.size() > Settings.boardSize
                    ? Orientation.VERTICAL
                    : coord.y+ship.size() > Settings.boardSize
                        ? Orientation.HORIZONTAL
                        : this.randomizer.randomEnum(Orientation);

                board.addShip(new ShipArrangement(ship, coord));
                success = true;
            } catch (e) {}
        } while (!success);
    }
}