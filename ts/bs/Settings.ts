import {Setup} from "./model/Setup";
import {ShipConfig} from "./model/ShipConfig";
import {Carrier} from "./model/ship/Carrier";
import {Battleship} from "./model/ship/Battleship";
import {Destroyer} from "./model/ship/Destroyer";
import {Patrol} from "./model/ship/Patrol";

export class Settings {
    public static readonly boardSize = 10;

    public static standardSetup(): Setup {
        const setup = new Setup();
        setup.addToConfig(new ShipConfig(Carrier.name, 1));
        setup.addToConfig(new ShipConfig(Battleship.name, 1));
        setup.addToConfig(new ShipConfig(Destroyer.name, 2));
        setup.addToConfig(new ShipConfig(Patrol.name, 1));
        return setup;
    }

}