import {Board} from "../interface/Board";
import {HitMap} from "../model/HitMap";
import {ShipArrangement} from "../model/ShipArrangement";
import {Coord} from "../model/Coord";
import {Orientation} from "../../core/enum/Orientation";
import {OutOfBoundsException} from "../../core/exception/OutOfBoundsException";
import {Helper} from "../Helper";
import {CollisionException} from "../exception/CollisionException";
import {DoubleTapException} from "../exception/DoubleTapException";
import {IShip} from "../interface/IShip";

export class BoardImpl implements Board {

    private readonly SIZE = 10;

    private hitMap: HitMap = new HitMap();
    private ships: ShipArrangement[] = [];

    constructor(board: Board = null) {
        if (board) {
            this.hitMap = board.getHitMap();
            this.ships = board.getShips().filter(s => s.ship.isSunk());
        }
    }

    size(): number {
        return this.SIZE;
    }

    addShip(arrangement: ShipArrangement): void {
        this.checkBounds(arrangement.ship.size(), arrangement.coord);
        this.checkCollision(arrangement.ship.size(), arrangement.coord);
        this.ships.push(arrangement);
    }

    isBeaten(): boolean {
        return this.ships.filter(s => s.ship.isSunk()).length == this.ships.length;
    }

    shoot(x: number, y: number): boolean {
        this.checkBoundsCoord(x, y);
        if (this.hitMap.alreadyHit(x, y)) {
            throw new DoubleTapException();
        }
        let hit = this.isHit([x, y]);
        this.hitMap.placeHit(x, y, hit);
        return hit;
    }

    getHitMap(): HitMap {
        return this.hitMap;
    }

    getShips(): ShipArrangement[] {
        return this.ships;
    }

    private checkBounds(length: number, coord: Coord): void {
        this.checkBoundsCoord(coord.x + (coord.o === Orientation.HORIZONTAL ? length-1 : 0), coord.y);
        this.checkBoundsCoord(coord.x, coord.y + (coord.o === Orientation.VERTICAL ? length-1 : 0));
    }

    private checkBoundsCoord(x: number, y: number): void {
        if (Math.min(x, y) < 0 || Math.max(x, y) >= this.SIZE) {
        throw new OutOfBoundsException();
        }
    }

    private checkCollision(length: number, coord: Coord): void {
        let newShipCoordinates = Helper.shipCoordinates(length, coord);

        for (let i=0; i < this.ships.length; i++) {
            let existingShipCoordinates = Helper.shipCoordinates(this.ships[i].ship.size(), this.ships[i].coord);
            if (this.haveCommonEntry(newShipCoordinates, existingShipCoordinates)) {
                throw new CollisionException();
            }
        }
    }

    private haveCommonEntry(array1: number[][], array2: number[][]): boolean {
        for (let i = 0; i < array1.length; i++) {
            if (this.containsEntry(array1[i], array2)) {
                return true;
            }
        }
        return false;
    }

    private containsEntry(needle: number[], haystack: number[][]) {
        for (let i = 0; i < haystack.length; i++) {
            if (needle[0] === haystack[i][0] && needle[1] === haystack[i][1]) {
                return true;
            }
        }
        return false;
    }

    private isHit(coords: number[]): boolean {
        for (let i=0; i < this.ships.length; i++) {
            let shipCoordinates = Helper.shipCoordinates(this.ships[i].ship.size(), this.ships[i].coord);
            if (this.containsEntry(coords, shipCoordinates)) {
                this.checkSunk(this.ships[i].ship, coords, shipCoordinates);
                return true;
            }
        }
        return false;
    }

    private checkSunk(ship: IShip, shot: number[], coords: number[][]): void {
        for (let i=0; i < coords.length; i++) {
            if (!(coords[i][0] == shot[0] && coords[i][1] == shot[1]) && !this.hitMap.alreadyHit(coords[i][0], coords[i][1])) {
                return;
            }
        }
        ship.sink();
    }
}