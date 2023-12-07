import {Coord} from "./model/Coord";
import {Orientation} from "../core/enum/Orientation";
import {Carrier} from "./model/ship/Carrier";
import {Battleship} from "./model/ship/Battleship";
import {Destroyer} from "./model/ship/Destroyer";
import {Patrol} from "./model/ship/Patrol";

export class Helper {
    public static shipCoordinates(length: number, coord: Coord): number[][] {
        const list = [];
        let x = coord.x;
        let y = coord.y;
        for (let i = 0; i < length; i++) {
            list.push([x, y]);
            if (coord.o === Orientation.VERTICAL)
                y++;
            else
                x++;
        }
        return list;
    }

    public static readonly shipConstructors = {
        "Carrier": () => {return new Carrier()},
        "Battleship": () => {return new Battleship()},
        "Destroyer": () => {return new Destroyer()},
        "Patrol": () => {return new Patrol()},
    };
}