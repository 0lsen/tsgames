import {Opponent} from "../../interface/Opponent";
import {Board} from "../../interface/Board";
import {Setup} from "../../model/Setup";
import {Shot} from "../../model/Shot";
import {Randomizer} from "../../../core/interface/Randomizer";
import {HeatMapper} from "../../interface/HeatMapper";
import {SpaceCalculator} from "../../interface/SpaceCalculator";
import {SetupException} from "../../exception/SetupException";
import {BoardImpl} from "../BoardImpl";
import {IShip} from "../../interface/IShip";
import {ThisShouldNeverHappenException} from "../../../core/exception/ThisShouldNeverHappenException";
import {Helper} from "../../Helper";
import {Orientation} from "../../../core/enum/Orientation";
import {Settings} from "../../Settings";

export class ProbabilityBasedOpponent implements Opponent {

    private randomizer: Randomizer;
    private heatMapper: HeatMapper;
    private spaceCalculator: SpaceCalculator;

    private board: Board;
    private boardView: Board;
    private shot: Shot;
    private setup: Setup;

    private freeMap: boolean[][];
    private minLength: number;
    private maxLength: number;

    private hitsOnUnsunkShips: number[];

    constructor(randomizer: Randomizer, heatMapper: HeatMapper, spaceCalculator: SpaceCalculator) {
        this.randomizer = randomizer;
        this.heatMapper = heatMapper;
        this.spaceCalculator = spaceCalculator;
    }

    placeShipsOn(board: Board, setup: Setup): void {
        throw new SetupException();
    }

    shootAt(board: Board, shot: Shot, setup: Setup): void {
        this.board = board;
        this.shot = shot;
        this.setup = setup;
        this.boardView = new BoardImpl(board);

        this.shoot();
    }

    private shoot(): void {
        this.setMinMaxLength();

        if (this.noHitsOnUnsunkShips()) {
            this.shootAtNewTarget();
        } else {
            this.shootAtKnownTarget();
        }
    }

    private setMinMaxLength():void {
        let remainingShips = this.remainingShips();

        let minLength = remainingShips.reduce((min, ship) => Math.min(min, ship.size()), Infinity);
        let maxLength = remainingShips.reduce((max, ship) => Math.max(max, ship.size()), 0);
        if (minLength !== 0 && maxLength !== Infinity) {
            this.minLength = minLength;
            this.maxLength = maxLength;
        } else {
            throw new ThisShouldNeverHappenException();
        }
    }

    private remainingShips(): IShip[] {
        let remainingShips = this.setup.getShips();
        let sunkShips:IShip[] = [];
        this.boardView.getShips().forEach(sa => sunkShips.push(sa.ship));

        for (let i=0; i < sunkShips.length; i++) {
            for (let j = 0; j < remainingShips.length; j++) {
                if (sunkShips[i].constructor.name === remainingShips[j].constructor.name) {
                    remainingShips.splice(j, 1);
                    break;
                }
            }
        }
        return remainingShips;
    }

    private noHitsOnUnsunkShips(): boolean {
        let sunkShipsCoordinates = [];
        this.boardView.getShips().forEach(sa => {
            let coords = Helper.shipCoordinates(sa.ship.size(), sa.coord);
            coords.forEach(c => sunkShipsCoordinates.push(c));
        });

        let allHitCoordinates = [];
        for (let i=0; i < this.boardView.getHitMap().hit.length; i++) {
            if (this.boardView.getHitMap().hit[i]) {
                allHitCoordinates.push([this.boardView.getHitMap().coordX[i], this.boardView.getHitMap().coordY[i]]);
            }
        }

        this.hitsOnUnsunkShips = allHitCoordinates.filter(coord => {
            for (let i=0; i < sunkShipsCoordinates.length; i++) {
                if (coord[0] === sunkShipsCoordinates[i][0] && coord[1] === sunkShipsCoordinates[i][1]) {
                    return false;
                }
            }
            return true;
        });

        return !this.hitsOnUnsunkShips.length;
    }

    private shootAtNewTarget(): void {
        let heatMap = this.heatMapper.build(this.boardView.getHitMap(), this.minLength, this.maxLength);
        let sum = heatMap.getHeat().reduce((sum, heat) => sum+heat, 0);
        let rand = this.randomizer.randomInt(sum);
        for (let i = 0; i < heatMap.getHeat().length; i++) {
            rand = rand-heatMap.getHeat()[i];
            if (rand < 1) {
                this.shot.x = heatMap.coordX[i];
                this.shot.y = heatMap.coordY[i];
                try {
                    this.shot.hit = this.board.shoot(this.shot.x, this.shot.y);
                    break;
                } catch (e) {
                    throw new ThisShouldNeverHappenException();
                }
            }
        }
    }

    private shootAtKnownTarget(): void {
        let orientation = this.hitsOnUnsunkShips.length > 1 ? this.determineLikelyOrientation() : null;
        this.shootAtAdjacentField(orientation);
    }

    private determineLikelyOrientation(): Orientation  {
        if (this.hitsOnUnsunkShips[0][0] === this.hitsOnUnsunkShips[1][0]) {
            return Orientation.VERTICAL;
        }
        if (this.hitsOnUnsunkShips[0][1] === this.hitsOnUnsunkShips[1][1]) {
            return Orientation.HORIZONTAL;
        }
        throw new ThisShouldNeverHappenException();
    }

    private shootAtAdjacentField(preferredOrientation: Orientation): void {
        this.buildFreeMap();
        let x = this.hitsOnUnsunkShips[0][0];
        let y = this.hitsOnUnsunkShips[0][1];
        let success: boolean;
        if (preferredOrientation == null) {
            preferredOrientation = this.randomizer.randomEnum(Orientation);
        }
        let direction = this.randomizer.randomBool();
        if (this.isThereEnoughSpace(x, y, preferredOrientation)) {
            success = this.attemptShot(x, y, direction, preferredOrientation);
            if (success) {
                return;
            }
            direction = !direction;
            success = this.attemptShot(x, y, direction, preferredOrientation);
            if (success) {
                return;
            }
        }
        direction = this.randomizer.randomBool();
        preferredOrientation = preferredOrientation === Orientation.HORIZONTAL ? Orientation.VERTICAL : Orientation.HORIZONTAL;
        success = this.attemptShot(x, y, direction, preferredOrientation);
        if (success) {
            return;
        }
        direction = !direction;
        success = this.attemptShot(x, y, direction, preferredOrientation);
        if (!success) {
            throw new ThisShouldNeverHappenException();
        }
    }

    private buildFreeMap(): void {
        this.freeMap = this.spaceCalculator.buildFreeMap(this.boardView.getHitMap());
        this.hitsOnUnsunkShips.forEach(s => this.freeMap[s[0]][s[1]] = true);
    }

    private isThereEnoughSpace(x: number, y: number, orientation: Orientation): boolean {
        return this.spaceCalculator.calculateSpace(x, y, orientation, this.maxLength, this.freeMap) >= this.minLength;
    }

    private attemptShot(x: number, y: number, direction: boolean, orientation: Orientation): boolean {
        let i = x;
        let j = y;
        while (this.isUnsunkShipHit(i, j) && this.isInBounds(i, j, direction, orientation)) {
            switch (orientation) {
                case Orientation.HORIZONTAL:
                        i = direction ? i+1 : i-1;
                    break;
                case Orientation.VERTICAL:
                        j = direction ? j+1 : j-1;
                    break;
            }
        }
        if (!this.boardView.getHitMap().alreadyHit(i, j)) {
            this.placeShot(i, j);
            return true;
        } else {
            return false;
        }
    }

    private isUnsunkShipHit(x: number, y: number): boolean {
        return this.hitsOnUnsunkShips.filter(h => h[0] === x && h[1] === y).length > 0;
    }

    private isInBounds(x: number, y: number, direction: boolean, orientation: Orientation): boolean {
        if (orientation === Orientation.HORIZONTAL) {
            x = direction ? x+1 : x-1;
        } else {
            y = direction ? y+1 : y-1;
        }
        return x < Settings.boardSize && y < Settings.boardSize && x >= 0 && y >= 0;
    }

    private placeShot(x: number, y: number): void {
        this.shot.x = x;
        this.shot.y = y;
        try {
            this.shot.hit = this.board.shoot(x, y);
        } catch (e) {
            throw new ThisShouldNeverHappenException();
        }
    }
}