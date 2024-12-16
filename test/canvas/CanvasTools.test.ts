import {CanvasTools} from "../../ts/canvas/CanvasTools";
import {CanvasBall} from "../../ts/canvas/model/CanvasBall";
import {Coord} from "../../ts/core/model/Coord";

const chai = require('chai');
const mocha = require('mocha');

mocha.describe('CanvasTools', () => {

    mocha.it('detects grab', () => {
        const ball = new CanvasBall(100, 100, 50);

        chai.expect(CanvasTools.isBallGrab(new Coord(100, 100), ball)).to.be.true;
        chai.expect(CanvasTools.isBallGrab(new Coord(50, 100), ball)).to.be.true;
        chai.expect(CanvasTools.isBallGrab(new Coord(100, 50), ball)).to.be.true;
        chai.expect(CanvasTools.isBallGrab(new Coord(150, 100), ball)).to.be.true;
        chai.expect(CanvasTools.isBallGrab(new Coord(100, 150), ball)).to.be.true;
        chai.expect(CanvasTools.isBallGrab(new Coord(64.65, 64.65), ball)).to.be.true;

        chai.expect(CanvasTools.isBallGrab(new Coord(50, 50), ball)).to.be.false;
        chai.expect(CanvasTools.isBallGrab(new Coord(64.64, 64.64), ball)).to.be.false;

        chai.expect(CanvasTools.isBallGrab(new Coord(57.58, 57.58), ball, 10)).to.be.true;
        chai.expect(CanvasTools.isBallGrab(new Coord(57.57, 57.57), ball, 10)).to.be.false;
    });

    mocha.it('detects collision', () => {
        const ball = new CanvasBall(100, 100, 50);

        chai.expect(CanvasTools.isBallCollision(ball, new CanvasBall(100, 100, 1))).to.be.true;
        chai.expect(CanvasTools.isBallCollision(ball, new CanvasBall(1, 100, 50))).to.be.true;
        chai.expect(CanvasTools.isBallCollision(ball, new CanvasBall(0, 100, 51))).to.be.true;
        chai.expect(CanvasTools.isBallCollision(ball, new CanvasBall(0, 0, 91.43))).to.be.true;

        chai.expect(CanvasTools.isBallCollision(ball, new CanvasBall(0, 0, 50))).to.be.false;
        chai.expect(CanvasTools.isBallCollision(ball, new CanvasBall(0, 100, 50))).to.be.false;
        chai.expect(CanvasTools.isBallCollision(ball, new CanvasBall(0, 0, 91.42))).to.be.false;
    });
});