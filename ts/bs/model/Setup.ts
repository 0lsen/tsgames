import {ShipConfig} from "./ShipConfig";
import {IShip} from "../interface/IShip";
import {SetupException} from "../exception/SetupException";
import {Helper} from "../Helper";

export class Setup {
    private shipConfigs: ShipConfig[] = [];
    private shipsSet: IShip[] = [];

    public copy(): Setup {
        let setup = new Setup();
        this.shipConfigs.forEach(sc => setup.addToConfig(sc));
        return setup;
    }

    public addToConfig(config: ShipConfig): void {
        if (this.shipConfigs.find(sc => sc.clazz === config.clazz)) {
            throw new SetupException();
        }
        this.shipConfigs.push(config);
    }

    public checkShip(ship: IShip): void {
        let correspondingConfig = this.shipConfigs.find(sc => sc.clazz === ship.constructor.name);
        if (correspondingConfig === undefined || this.shipsSet.filter(ss => ss.constructor.name === ship.constructor.name).length >= correspondingConfig.count) {
            throw new SetupException();
        }
    }

    public addShip(ship: IShip): void {
        this.shipsSet.push(ship);
    }

    public isComplete(): boolean {
        for (let i=0; i < this.shipConfigs.length; i++) {
            if (this.shipsSet.filter(ss => ss.constructor.name === this.shipConfigs[i].clazz).length != this.shipConfigs[i].count) {
                return false;
            }
        }
        return true;
    }

    public getShips(): IShip[] {
        let list:IShip[] = [];
        this.shipConfigs.forEach(sc => {
            for (let i=0; i < sc.count; i++) {
                let ship = Helper.shipConstructors[sc.clazz]();
                list.push(ship);
            }
        });
        return list;
    }
}