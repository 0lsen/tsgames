import {Star} from "./model/Star";
import {Cloud} from "./model/Cloud";
import {Building} from "./model/Building";
import {Roof} from "./model/Roof";
import {Present} from "./model/Present";
import {Coord} from "../core/model/Coord";
import {Settings} from "./model/Settings";
import {CanvasContext} from "../canvas/CanvasContext";

export class DrawHelper {

    private readonly dimensions : Coord;
    private readonly context : CanvasContext;
    private readonly settings : Settings;

    constructor(dimensions: Coord, context: CanvasContext, settings: Settings) {
        this.dimensions = dimensions;
        this.context = context;
        this.settings = settings;
    }

    public drawBackground() : void {
        this.context.beginPath();
        this.context.fillStyle = this.skyGradient();
        this.context.rect(0, 0, this.dimensions.x, this.dimensions.y);
        this.context.fill();
        this.context.closePath();
    }

    public drawStar(star : Star) : void {
        this.context.beginPath();
        this.context.fillStyle = star.color.toString();
        this.context.arc(star.x, star.y, star.radius, 0, Math.PI*2);
        this.context.fill();
        this.context.closePath();
    }

    public drawCloud(cloud : Cloud) : void {
        this.context.fillStyle = cloud.color.toString();
        cloud.segments.forEach(segment => {
            this.context.beginPath();
            this.context.arc(cloud.x+segment.x, cloud.y+segment.y, segment.radius, 0, Math.PI*2);
            this.context.fill();
            this.context.closePath();
        });
    }

    public drawBuilding(building : Building) : void {
        this.context.fillStyle = '#000';
        this.context.beginPath();
        this.context.rect(
            building.x,
            this.dimensions.y-building.y,
            building.width,
            building.y
        )
        this.context.fill();
        this.context.closePath();

        const windowGap = (building.width - 2*this.settings.buildingWindowWidth)/3;
        this.context.fillStyle = '#eb5';
        this.context.shadowBlur = 30;
        this.context.shadowColor = '#eb5';
        for (let i = 0; i < 2; i++) {
            for (let j = 0; j < 2; j++) {
                if (building.litWindows[2*i+j]) {
                    this.context.beginPath();
                    this.context.rect(
                        building.x+j*(this.settings.buildingWindowWidth+windowGap)+windowGap,
                        this.dimensions.y-building.y+2*i*(this.settings.buildingWindowHeight)+this.settings.buildingWindowHeight,
                        this.settings.buildingWindowWidth,
                        this.settings.buildingWindowHeight
                    );
                    this.context.fill();
                    this.context.closePath();
                }
            }
        }
        this.context.shadowBlur = 0;
    }

    public drawRoof(roof : Roof) : void {
        this.context.fillStyle = '#d35';
        this.context.beginPath();
        this.context.rect(
            roof.x,
            this.dimensions.y-roof.y,
            roof.width,
            (1-roof.building)*roof.y
        );
        this.context.fill();
        this.context.closePath();

        this.context.fillStyle = '#ddb';
        this.context.beginPath();
        this.context.rect(
            roof.x+this.settings.roofBuildingGap,
            this.dimensions.y-roof.building*roof.y,
            roof.width-2*this.settings.roofBuildingGap,
            roof.building*roof.y
        );
        this.context.fill();
        this.context.closePath();

        this.context.beginPath();
        this.context.rect(
            roof.x+roof.chimney.x,
            this.dimensions.y-roof.y-roof.chimney.height+roof.chimney.y,
            roof.chimney.width,
            roof.chimney.height
        );
        this.context.fill();
        this.context.closePath();
    }

    public drawPresent(present : Present) : void {
        this.context.fillStyle = present.color.toString();
        this.context.beginPath();
        this.context.moveTo(this.settings.presentSize * Math.cos(present.currentRotation  + Math.PI/4) + present.x, this.settings.presentSize * Math.sin(present.currentRotation  + Math.PI/4) + present.y);
        for (let i = 1; i < 4; i++) {
            this.context.lineTo(this.settings.presentSize * Math.cos(present.currentRotation  + Math.PI/4 + i*Math.PI/2) + present.x, this.settings.presentSize * Math.sin(present.currentRotation  + Math.PI/4 + i*Math.PI/2) + present.y);
        }
        this.context.fill();
        this.context.closePath();
    }

    private skyGradient() : CanvasGradient {
        const gradient = this.context.createLinearGradient(0, 0, 0, this.dimensions.y);
        gradient.addColorStop(0, '#017')
        gradient.addColorStop(0.65, '#45d')
        gradient.addColorStop(0.93, '#b49d6d')
        gradient.addColorStop(0.931, '#000')
        return gradient;
    }
}