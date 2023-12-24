import {CanvasBall} from "../../canvas/model/CanvasBall";

export class Settings {

    public readonly spawnDistance = 250;

    public readonly scrollSpeedStars = 0.1;
    public readonly scrollSpeedClouds = 0.3;
    public readonly scrollSpeedBuildings = 0.45;
    public readonly scrollSpeedRoofs = 1;

    public readonly starHeightMin = 400;
    public readonly starDistanceMin = 20;
    public readonly starDistanceMax = 100;
    public readonly starSizeMin = 1;
    public readonly starSizeMax = 4;
    public readonly starHueMin = 45;
    public readonly starHueMax = 55;
    public readonly starSaturationMin = 80;
    public readonly starSaturationMax = 100;
    public readonly starLightnessMin = 70;
    public readonly starLightnessMax = 100;

    public readonly cloudHeightMax = 25;
    public readonly cloudHeightMin = 225;
    public readonly cloudDistanceMin = 200;
    public readonly cloudDistanceMax = 400;
    public readonly cloudAlphaMin = 20;
    public readonly cloudAlphaMax = 50;
    public readonly cloudConfigs = [
        [
            new CanvasBall(30, 60, 30),
            new CanvasBall(45, 45, 21),
            new CanvasBall(80, 49, 28),
            new CanvasBall(66, 81, 35),
            new CanvasBall(93, 72, 27),
        ],
    ];

    public readonly buildingGapMin = 20;
    public readonly buildingGapMax = 60;
    public readonly buildingHeightMin = 50;
    public readonly buildingHeightMax = 100;
    public readonly buildingWidthMin = 30;
    public readonly buildingWidthMax = 50;
    public readonly buildingWindowHeight = 10;
    public readonly buildingWindowWidth = 7;

    public readonly roofGapMin = 50;
    public readonly roofGapMax = 100;
    public readonly roofHeightMin = 50;
    public readonly roofHeightMax = 80;
    public readonly roofWidthMin = 120;
    public readonly roofWidthMax = 240;
    public readonly roofBuildingMin = 0.2;
    public readonly roofBuildingMax = 0.4   ;
    public readonly roofBuildingGap = 10;
    public readonly chimneyHeightMin = 30;
    public readonly chimneyHeightMax = 50;
    public readonly chimneyWidthMin = 50;
    public readonly chimneyWidthMax = 60;

    public readonly sleighXPosition = 40;
    public readonly sleighHeightMin = 150;
    public readonly sleighHeightMax = 270;

    public readonly presentNumber = 20;
    public readonly presentDelay = 100;
    public readonly presentColors = 5;
    public readonly presentSize = 20;

    public readonly throwMinDistance = 20;
    public readonly throwMaxAngle = 1;
    public readonly throwVelocityMin = 3;
    public readonly throwVelocityMax = 10;

    public readonly textSize = 20;
    public readonly textOffset = 20;
}