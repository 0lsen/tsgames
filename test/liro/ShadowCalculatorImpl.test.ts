import {ShadowCalculatorImpl} from "../../ts/liro/impl/ShadowCalculatorImpl";
import {Coord} from "../../ts/core/model/Coord";
import {CanvasBall} from "../../ts/canvas/model/CanvasBall";
import {HSL} from "../../ts/canvas/model/HSL";
import {Pillar} from "../../ts/liro/model/Pillar";
import {CanvasContextMock} from "../canvas/CanvasContextMock";
import {CanvasGradientMock} from "../canvas/CanvasGradientMock";

const chai = require('chai');
const mocha = require('mocha');

const lightHue = 123;
const lightSaturation = 40;
const lightLightnessBrightest = 80;
const lightLightnessDarkest = 0;
const pillarHue = 15;
const pillarSaturation = 50;
const pillarLightness = 30;
const dimensions = new Coord(200, 100);
const context = new CanvasContextMock();
const lightSource = new CanvasBall(100, 50, 10);
const lightHslBrightest = new HSL(lightHue, lightSaturation, lightLightnessBrightest);
const lightHslDarkest = new HSL(lightHue, lightSaturation, lightLightnessDarkest);
const pillarHsl = new HSL(pillarHue, pillarSaturation, pillarLightness);
const calc = new ShadowCalculatorImpl(dimensions, context, lightSource, lightHslBrightest, lightHslDarkest);

declare global {
    var DEBUG : boolean;
}
global.DEBUG = true;

mocha.describe('ShadowCalculator', () => {

    mocha.it('single pillar shadow', () => {
        const result = calc.calcPillarShadow(new Pillar(50, 25, 10, pillarHsl), [], 0);

        chai.expect(Math.round(result.pillarEdge1.x)).to.equal(56);
        chai.expect(Math.round(result.pillarEdge1.y)).to.equal(17);
        chai.expect(Math.round(result.pillarEdge2.x)).to.equal(47);
        chai.expect(Math.round(result.pillarEdge2.y)).to.equal(35);
        chai.expect(Math.round(result.canvasEdge1.x)).to.equal(0);
        chai.expect(Math.round(result.canvasEdge1.y)).to.equal(-25);
        chai.expect(Math.round(result.canvasEdge2.x)).to.equal(0);
        chai.expect(Math.round(result.canvasEdge2.y)).to.equal(21);
    });

    mocha.it('pillar shadow with non obstructing other pillar', () => {
        const otherPillar = new Pillar(150, 25, 10, pillarHsl);
        otherPillar.shadow = calc.calcPillarShadow(otherPillar, [], 0);
        const result = calc.calcPillarShadow(new Pillar(50, 25, 10, pillarHsl), [otherPillar], 0);

        chai.expect(Math.round(result.pillarEdge1.x)).to.equal(56);
        chai.expect(Math.round(result.pillarEdge1.y)).to.equal(17);
        chai.expect(Math.round(result.pillarEdge2.x)).to.equal(47);
        chai.expect(Math.round(result.pillarEdge2.y)).to.equal(35);
        chai.expect(Math.round(result.canvasEdge1.x)).to.equal(0);
        chai.expect(Math.round(result.canvasEdge1.y)).to.equal(-25);
        chai.expect(Math.round(result.canvasEdge2.x)).to.equal(0);
        chai.expect(Math.round(result.canvasEdge2.y)).to.equal(21);
    });

    mocha.it('pillar shadow with fully covering other pillar', () => {
        const coveringPillar = new Pillar(70, 35, 15, pillarHsl);
        coveringPillar.shadow = calc.calcPillarShadow(coveringPillar, [], 0);
        const result = calc.calcPillarShadow(new Pillar(40, 20, 10, pillarHsl), [coveringPillar], 0);

        chai.expect(result).to.be.undefined;
    });

    mocha.it('pillar shadow with partially obstructing other pillar', () => {
        const otherPillar = new Pillar(70, 25, 10, pillarHsl);
        otherPillar.shadow = calc.calcPillarShadow(otherPillar, [], 0);
        const result = calc.calcPillarShadow(new Pillar(40, 20, 10, pillarHsl), [otherPillar], 0);

        chai.expect(Math.round(result.pillarEdge1.x)).to.equal(48);
        chai.expect(Math.round(result.pillarEdge1.y)).to.equal(26);
        chai.expect(Math.round(result.pillarEdge2.x)).to.equal(37);
        chai.expect(Math.round(result.pillarEdge2.y)).to.equal(30);
        chai.expect(Math.round(result.canvasEdge1.x)).to.equal(0);
        chai.expect(Math.round(result.canvasEdge1.y)).to.equal(3);
        chai.expect(Math.round(result.canvasEdge2.x)).to.equal(0);
        chai.expect(Math.round(result.canvasEdge2.y)).to.equal(18);
    });

    mocha.it('pillar gradient', () => {
        const result = calc.calcPillarGradient(new Pillar(50, 25, 10, pillarHsl), 70);
        const numbersStop1 = ((result as CanvasGradientMock).colorStops.get(0) as string).match(/[(,]\d+/g);
        const numbersStop2 = ((result as CanvasGradientMock).colorStops.get(1) as string).match(/[(,]\d+/g);
        const hue1 = numbersStop1 ? parseInt(numbersStop1[0].substring(1)) : null;
        const hue2 = numbersStop2 ? parseInt(numbersStop2[0].substring(1)) : null;
        const sat1 = numbersStop1 ? parseInt(numbersStop1[1].substring(1)) : null;
        const sat2 = numbersStop2 ? parseInt(numbersStop2[1].substring(1)) : null;
        const lig1 = numbersStop1 ? parseInt(numbersStop1[2].substring(1)) : null;
        const lig2 = numbersStop2 ? parseInt(numbersStop2[2].substring(1)) : null;

        chai.expect(hue1).to.equal(pillarHue);
        chai.expect(hue2).to.equal(pillarHue);
        chai.expect(sat1).to.be.greaterThan(sat2);
        chai.expect(lig1).to.be.greaterThan(lig2);
    });

    mocha.it('light source gradient', () => {
        const result = calc.calcLightSourceGradient(40, 0);
        const numbersStop1 = ((result as CanvasGradientMock).colorStops.get(0) as string).match(/[(,]\d+/g);
        const numbersStop2 = ((result as CanvasGradientMock).colorStops.get(1) as string).match(/[(,]\d+/g);
        const hue1 = numbersStop1 ? parseInt(numbersStop1[0].substring(1)) : null;
        const hue2 = numbersStop2 ? parseInt(numbersStop2[0].substring(1)) : null;
        const sat1 = numbersStop1 ? parseInt(numbersStop1[1].substring(1)) : null;
        const sat2 = numbersStop2 ? parseInt(numbersStop2[1].substring(1)) : null;
        const lig1 = numbersStop1 ? parseInt(numbersStop1[2].substring(1)) : null;
        const lig2 = numbersStop2 ? parseInt(numbersStop2[2].substring(1)) : null;

        chai.expect(hue1).to.equal(lightHue);
        chai.expect(hue2).to.equal(lightHue);
        chai.expect(sat1).to.equal(lightSaturation);
        chai.expect(sat2).to.equal(lightSaturation);
        chai.expect(lig1).to.equal(lightLightnessBrightest);
        chai.expect(lig2).to.equal(0);
    });
});