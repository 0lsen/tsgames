import {ArcCalcImpl} from "../../ts/ciso/impl/ArcCalcImpl";
import {ArcOptions} from "../../ts/ciso/model/ArcOptions";
import {Pillar} from "../../ts/ciso/model/Pillar";

const chai = require('chai');
const mocha = require('mocha');

const calc = new ArcCalcImpl();
const width = 100;
const hueActive = 0;
const hueInactive = 200;
calc.setArcWidth(width);

mocha.describe('CiSo ArcCalc', () => {
    mocha.it('inner arcs', () => {
        let options : ArcOptions[];
        const pillar = new Pillar(100);

        options = calc.innerArcs(pillar, 1, 2, 0);
        chai.expect(options.length).to.equal(2);
        chai.expect(options[0].color.hue).to.equal(hueInactive);
        chai.expect(Math.round(options[0].width)).to.equal(110);
        chai.expect(options[1].color.hue).to.equal(hueActive);
        chai.expect(options[1].width).to.equal(0);

        options = calc.innerArcs(pillar, 1, 2, 0.075);
        chai.expect(options.length).to.equal(2);
        chai.expect(options[0].color.hue).to.equal(hueInactive);
        chai.expect(Math.round(options[0].width)).to.equal(55);
        chai.expect(options[1].color.hue).to.equal(hueActive);
        chai.expect(Math.round(options[1].width)).to.equal(45);

        options = calc.innerArcs(pillar, 1, 2, 0.5);
        chai.expect(options.length).to.equal(1);
        chai.expect(options[0].color.hue).to.equal(hueActive);
        chai.expect(Math.round(options[0].width)).to.equal(91);

        options = calc.innerArcs(pillar, 1, 2, 0.925);
        chai.expect(options.length).to.equal(2);
        chai.expect(options[0].color.hue).to.equal(hueActive);
        chai.expect(Math.round(options[0].width)).to.equal(45);
        chai.expect(options[1].color.hue).to.equal(hueInactive);
        chai.expect(Math.round(options[1].width)).to.equal(55);

        options = calc.innerArcs(pillar, 1, 2, 1);
        chai.expect(options.length).to.equal(2);
        chai.expect(options[0].color.hue).to.equal(hueActive);
        chai.expect(options[0].width).to.equal(0);
        chai.expect(options[1].color.hue).to.equal(hueInactive);
        chai.expect(Math.round(options[1].width)).to.equal(110);
    });
});