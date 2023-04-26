import {ShadowCalculatorImpl} from "../../ts/liro/impl/ShadowCalculatorImpl";
import {Coord} from "../../ts/core/model/Coord";
import {CanvasBall} from "../../ts/canvas/model/CanvasBall";
import {HSL} from "../../ts/canvas/model/HSL";

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
// TODO: mock context
const context = undefined;
const lightSource = new CanvasBall(100, 50, 10);
const lightHslBrightest = new HSL(lightHue, lightSaturation, lightLightnessBrightest);
const lightHslDarkest = new HSL(lightHue, lightSaturation, lightLightnessDarkest);
const pillarHsl = new HSL(pillarHue, pillarSaturation, pillarLightness);
const calc = new ShadowCalculatorImpl(dimensions, context, lightSource, lightHslBrightest, lightHslDarkest);

mocha.describe('ShadowCalculator', () => {
    mocha.it('TODO', () => {

    });
});