import {CanvasApp} from "../canvas/CanvasApp";
import {Coord} from "../core/model/Coord";
import {Star} from "./model/Star";
import {Settings} from "./model/Settings";
import {Cloud} from "./model/Cloud";
import {Roof} from "./model/Roof";
import {Building} from "./model/Building";
import {Present} from "./model/Present";
import {Line} from "../liro/model/Line";
import {CanvasTools} from "../canvas/CanvasTools";
import {MovementCalculatorImpl} from "../cadi/impl/MovementCalculatorImpl";
import {QuadraticFormulaSolverImpl} from "../core/impl/QuadraticFormulaSolverImpl";
import {MovementCalculator} from "../cadi/interface/MovementCalculator";
import {EntityCreator} from "./EntityCreator";
import {DrawHelper} from "./DrawHelper";

export class App extends CanvasApp {

    protected readonly _dimensions = new Coord(1000, 500);

    private readonly settings = new Settings();

    private readonly entityCreator : EntityCreator;
    private readonly drawHelper : DrawHelper;
    private readonly movementCalculator : MovementCalculator;

    private stars : Star[] = [];
    private clouds : Cloud[] = [];
    private buildings : Building[] = [];
    private roofs : Roof[] = [];
    private presents : Present[] = [];

    private mouseCoord : Coord;

    private presentsLoaded = this.settings.presentNumber;
    private presentsDelivered = 0;

    private nextStarSpawn : number = 0;
    private nextCloudSpawn : number = 0;
    private nextBuildingSpawn : number = 0;
    private nextRoofSpawn : number = 0;
    private nextPresentAllowed : number = 0;

    private tick = 0;

    constructor() {
        super();
        this.entityCreator = new EntityCreator(this.dimensions, this.settings, this.randomizer);
        this.drawHelper = new DrawHelper(this.dimensions, this.context, this.settings);
        this.movementCalculator = new MovementCalculatorImpl(new QuadraticFormulaSolverImpl());
        this.movementCalculator.setGravityConstant(0.3);
    }

    protected init() {
        super.init();
        this.populateBackground();
        this.canvas.addEventListener('mouseover', (e) => this.setMouseCoord(e));
        this.canvas.addEventListener('mousemove', (e) => this.setMouseCoord(e));
        this.canvas.addEventListener('click', (e) => this.createPresent(e));
        this.$resetButton.on('click', () => this.reset());
        this.draw();
    }

    private populateBackground() : void {
        const iterations = (this.dimensions.x+2*this.settings.spawnDistance)/this.settings.scrollSpeedStars;
        for (let i = 0; i < iterations; i++) {
            // TODO: maybe stop each type of entity after first of its kind is removed?
            this.scroll();
        }
    }

    private reset() : void {
        this.presents = [];
        this.presentsLoaded = this.settings.presentNumber;
        this.presentsDelivered = 0;
    }

    private draw() : void {
        this.clear();
        this.drawHelper.drawBackground();
        this.stars.forEach(s => this.drawHelper.drawStar(s));
        this.clouds.forEach(c => this.drawHelper.drawCloud(c));
        this.buildings.forEach(b => this.drawHelper.drawBuilding(b));
        this.roofs.forEach(r => this.drawHelper.drawRoof(r));
        this.presents.forEach(p => this.drawHelper.drawPresent(p));
        this.drawSleigh();
        this.drawStats();
        window.requestAnimationFrame(() => {
            this.scroll();
            this.draw();
        });
    }

    private scroll() : void {
        this.cleanEntities();
        if (this.nextStarSpawn < this.tick) {
            this.stars.push(this.entityCreator.createStar());
            this.nextStarSpawn = this.tick + this.randomizer.randomIntBetween(this.settings.starDistanceMin, this.settings.starDistanceMax)/this.settings.scrollSpeedStars;
        }
        if (this.nextCloudSpawn < this.tick) {
            this.clouds.push(this.entityCreator.createCloud());
            this.nextCloudSpawn = this.tick + this.randomizer.randomIntBetween(this.settings.cloudDistanceMin, this.settings.cloudDistanceMax)/this.settings.scrollSpeedClouds;
        }
        if (this.nextBuildingSpawn < this.tick) {
            const newBuilding = this.entityCreator.createBuilding();
            this.buildings.push(newBuilding);
            this.nextBuildingSpawn = this.tick + newBuilding.width+this.randomizer.randomIntBetween(this.settings.buildingGapMin, this.settings.buildingGapMax)/this.settings.scrollSpeedBuildings;
        }
        if (this.nextRoofSpawn < this.tick) {
            const newRoof = this.entityCreator.createRoof();
            this.roofs.push(newRoof);
            this.nextRoofSpawn = this.tick + newRoof.width+this.randomizer.randomIntBetween(this.settings.roofGapMin, this.settings.roofGapMax)/this.settings.scrollSpeedRoofs;
        }
        this.stars.forEach(s => s.x -= this.settings.scrollSpeedStars);
        this.clouds.forEach(c => c.x -= this.settings.scrollSpeedClouds);
        this.buildings.forEach(b => b.x -= this.settings.scrollSpeedBuildings);
        this.roofs.forEach(r => r.x -= this.settings.scrollSpeedRoofs);
        this.presents.forEach(p => {
            p.rotate();
            this.movePresent(p);
        });
        this.tick++;
    }

    private cleanEntities() : void {
        this.stars = this.cleanEnityList(this.stars);
        this.clouds = this.cleanEnityList(this.clouds);
        this.buildings = this.cleanEnityList(this.buildings);
        this.roofs = this.cleanEnityList(this.roofs);
        this.presents = this.presents.filter(p =>
            p.y < this.dimensions.y + this.settings.presentSize &&
            p.x > -this.settings.spawnDistance &&
            !this.presentHitsChimney(p)
        );
    }

    private cleanEnityList<T extends Coord>(list : T[]) : T[] {
        return list.length && list[0].x < -this.settings.spawnDistance ? list.splice(1) : list;
    }

    private presentHitsChimney(present : Present) : boolean {
        let hit = this.roofs.find(roof => {
            return Math.abs(this.dimensions.y - roof.y - roof.chimney.height + roof.chimney.y - present.y) < 10 &&
                roof.x+roof.chimney.x < present.x - this.settings.presentSize/2 &&
                roof.x+roof.chimney.x + roof.chimney.width > present.x + this.settings.presentSize/2;
        }) !== undefined;
        if (hit) {
            this.presentsDelivered++;
        }
        return hit;
    }

    private drawSleigh() : void {
        const sleigh = new Coord(this.currentSleighX(), this.currentSleighY());

        const sleighRadius = Math.SQRT2*this.settings.sleighXPosition;
        const skatesY = sleigh.y + this.settings.sleighXPosition + sleighRadius + 20;
        this.context.lineWidth = 10;

        this.context.strokeStyle = '#753';
        this.context.beginPath();
        this.context.moveTo(this.dimensions.x - this.settings.sleighXPosition/2, skatesY);
        this.context.lineTo(this.dimensions.x, sleigh.y+this.settings.sleighXPosition);
        this.context.stroke();
        this.context.closePath();
        this.context.beginPath();
        this.context.moveTo(this.dimensions.x - this.settings.sleighXPosition/2 - 20, skatesY);
        this.context.lineTo(this.dimensions.x, skatesY);
        this.context.stroke();
        this.context.closePath();

        this.context.fillStyle = '#b00';
        this.context.strokeStyle = '#cb0'
        this.context.beginPath();
        this.context.arc(this.dimensions.x, sleigh.y+this.settings.sleighXPosition, sleighRadius, 0, Math.PI*2);
        this.context.fill();
        this.context.stroke();
        this.context.closePath();

        this.context.lineWidth = 1;

        if (this.presentsLoaded > 0 && this.mouseCoord) {
            const angle = this.getThrowAngle(sleigh, this.mouseCoord);
            if (angle !== undefined) {
                const velocity = 10*Math.max(Math.min(CanvasTools.distance(sleigh, this.mouseCoord), this.settings.throwVelocityMax), this.settings.throwVelocityMin);
                const x = velocity / Math.sqrt(angle * angle + 1);
                const gradient = this.context.createLinearGradient(sleigh.x, sleigh.y, sleigh.x-x, sleigh.y+x*angle);
                gradient.addColorStop(0, '#ddd');
                gradient.addColorStop(1, 'rgba(221,221,221,0)');
                this.context.strokeStyle = gradient;
                this.context.beginPath();
                this.context.moveTo(sleigh.x, sleigh.y);
                this.context.lineTo(sleigh.x - x, sleigh.y+x*angle);
                this.context.stroke();
                this.context.closePath();
            }
        }
    }

    private drawStats() : void {
        this.context.fillStyle = '#ddd';
        this.context.font = this.settings.textSize+'px Arial';
        this.context.beginPath();
        this.context.fillText('Delivered: '+this.presentsDelivered+' / '+this.settings.presentNumber+' ('+(this.presentsLoaded+this.presents.length)+' left)', this.settings.textOffset, this.settings.textSize+this.settings.textOffset);
        this.context.closePath();
    }

    private setMouseCoord(e : MouseEvent) : void {
        this.mouseCoord = this.getMouseCoord(e);
    }

    private createPresent(e : MouseEvent) : void {
        if (this.presentsLoaded > 0 && this.nextPresentAllowed < this.tick) {
            const sleigh = new Coord(this.currentSleighX(), this.currentSleighY());
            const mouseCoord = this.getMouseCoord(e);
            const angle = this.getThrowAngle(sleigh, mouseCoord);
            if (angle !== undefined) {
                const velocity = 4*Math.max(Math.min(CanvasTools.distance(sleigh, mouseCoord), this.settings.throwVelocityMax), this.settings.throwVelocityMin);
                const x = velocity/Math.sqrt(angle*angle + 1);
                this.presents.push(new Present(
                    sleigh.x,
                    sleigh.y,
                    new Coord(
                        -x,
                    x*angle
                    ),
                    (this.randomizer.randomInt(10)-5)/100,
                    this.randomizer.randomInt(this.settings.presentColors) * 360/this.settings.presentColors
                ));
                this.nextPresentAllowed = this.tick+this.settings.presentDelay;
                this.presentsLoaded--;
            }
        }
    }

    private movePresent(present : Present) : void {
        present.x += present.velocity.x/10;
        present.y += present.velocity.y/10;
        present.velocity.y = this.movementCalculator.calcAcceleratedMovement(present.y, present.velocity.y, 10000, 0, 1, 0.5).newVelocity;
    }

    private getThrowAngle(sleigh : Coord, mouse : Coord) : number {
        if (mouse.x >= sleigh.x || CanvasTools.distance(sleigh, mouse) < this.settings.throwMinDistance) {
            return undefined;
        }
        const line = new Line(sleigh, mouse);
        return -Math.sign(line.m)*Math.min(this.settings.throwMaxAngle, Math.abs(line.m));
    }

    private currentSleighX() : number {
        return this.dimensions.x - this.settings.sleighXPosition;
    }

    private currentSleighY() : number {
        const averageHeight = (this.settings.sleighHeightMax+this.settings.sleighHeightMin)/2;
        return averageHeight + Math.sin(this.tick/50) * (this.settings.sleighHeightMin-averageHeight);
    }
}