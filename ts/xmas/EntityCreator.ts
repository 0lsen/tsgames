import {Star} from "./model/Star";
import {HSLA} from "../canvas/model/HSLA";
import {Cloud} from "./model/Cloud";
import {Building} from "./model/Building";
import {Roof} from "./model/Roof";
import {Chimney} from "./model/Chimney";
import {Settings} from "./model/Settings";
import {Randomizer} from "../core/interface/Randomizer";
import {Coord} from "../core/model/Coord";

export class EntityCreator {

    private readonly dimensions : Coord;
    private readonly settings : Settings;
    private readonly randomizer : Randomizer;

    constructor(dimensions: Coord, settings: Settings, randomizer: Randomizer) {
        this.dimensions = dimensions;
        this.settings = settings;
        this.randomizer = randomizer;
    }

    public createStar() : Star {
        let x = this.dimensions.x+this.settings.starSizeMax;
        let y = this.randomizer.randomInt(this.settings.starHeightMin);
        return new Star(
            x,
            y,
            this.randomizer.randomIntBetween(this.settings.starSizeMin, this.settings.starSizeMax)*(2*this.dimensions.y-y)/(2*this.dimensions.y),
            new HSLA(
                this.randomizer.randomIntBetween(this.settings.starHueMin, this.settings.starHueMax),
                this.randomizer.randomIntBetween(this.settings.starSaturationMin, this.settings.starSaturationMax),
                this.randomizer.randomIntBetween(this.settings.starLightnessMin, this.settings.starLightnessMax),
                100*(this.dimensions.y-y)/this.dimensions.y
            )
        );
    }

    public createCloud() : Cloud {
        return new Cloud(
            this.dimensions.x,
            this.randomizer.randomIntBetween(this.settings.cloudHeightMax, this.settings.cloudHeightMin),
            new HSLA(
                200,
                100,
                95,
                this.randomizer.randomIntBetween(this.settings.cloudAlphaMin, this.settings.cloudAlphaMax)
            ),
            this.randomizer.randomListEntry(this.settings.cloudConfigs)
        );
    }

    public createBuilding() : Building {
        return new Building(
            this.dimensions.x,
            this.randomizer.randomIntBetween(this.settings.buildingHeightMin, this.settings.buildingHeightMax),
            this.randomizer.randomIntBetween(this.settings.buildingWidthMin, this.settings.buildingWidthMax),
            Array(4).fill(null).map(() => this.randomizer.randomBool())
        );
    }

    public createRoof() : Roof {
        const roofHeight = this.randomizer.randomIntBetween(this.settings.roofHeightMin, this.settings.roofHeightMax);
        const roofWidth = this.randomizer.randomIntBetween(this.settings.roofWidthMin, this.settings.roofWidthMax);
        return new Roof(
            this.dimensions.x,
            roofHeight,
            roofWidth,
            this.randomizer.randomIntBetween(this.settings.roofBuildingMin*100, this.settings.roofBuildingMax*100)/100,
            new Chimney(
                this.randomizer.randomIntBetween(this.settings.chimneyWidthMax/2, roofWidth-this.settings.chimneyWidthMax),
                10,
                this.randomizer.randomIntBetween(this.settings.chimneyHeightMin, this.settings.chimneyHeightMax),
                this.randomizer.randomIntBetween(this.settings.chimneyWidthMin, this.settings.chimneyWidthMax)
            )
        );
    }
}