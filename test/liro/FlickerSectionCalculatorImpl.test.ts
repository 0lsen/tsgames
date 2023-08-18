import {RandomizerMock} from "../core/RandomizerMock";
import {FlickerSectionCalculatorImpl} from "../../ts/liro/impl/FlickerSectionCalculatorImpl";

const chai = require('chai');
const mocha = require('mocha');

const randomizer = new RandomizerMock();
const flickerSectionCalc = new FlickerSectionCalculatorImpl(randomizer);

mocha.describe('FlickerSectionCalculator', () => {
    mocha.it('does stuff', () => {

        randomizer.boolReturns = [true];
        randomizer.intReturns = [300, 2, 100, 1, 8, 100, 14, 50, 20, 100];

        let result = flickerSectionCalc.createSection();

        let sinValueMidway = round(Math.sin(Math.PI/4)*0.075);
        chai.expect(round(result[25])).to.equal(sinValueMidway);
        chai.expect(round(result[50])).to.equal(0.075);
        chai.expect(round(result[75])).to.equal(sinValueMidway);
        chai.expect(round(result[100])).to.equal(0);
        chai.expect(round(result[125])).to.equal(-sinValueMidway);
        chai.expect(round(result[150])).to.equal(-0.075);
        chai.expect(round(result[175])).to.equal(-sinValueMidway);
        chai.expect(round(result[200])).to.equal(0);
        chai.expect(round(result[225])).to.equal(sinValueMidway);
        chai.expect(round(result[250])).to.equal(0.075);
        chai.expect(round(result[275])).to.equal(sinValueMidway);
        chai.expect(round(result[300])).to.equal(0);
        chai.expect(round(result[325])).to.equal(-sinValueMidway);
        chai.expect(round(result[350])).to.equal(-0.075);
        chai.expect(round(result[375])).to.equal(-sinValueMidway);
        chai.expect(round(result[400])).to.equal(0);
        chai.expect(round(result[425])).to.equal(sinValueMidway);
        chai.expect(round(result[450])).to.equal(0.075);
        chai.expect(round(result[475])).to.equal(sinValueMidway);
        chai.expect(round(result[500])).to.equal(0);
        chai.expect(round(result[525])).to.equal(-sinValueMidway);
        chai.expect(round(result[550])).to.equal(-0.075);
        chai.expect(round(result[575])).to.equal(-sinValueMidway);
        chai.expect(round(result[600])).to.equal(0);

        chai.expect(round(result[603])).to.equal(-0.15);
        chai.expect(round(result[606])).to.equal(0);
        chai.expect(round(result[608])).to.equal(-0.037);
        chai.expect(round(result[610])).to.equal(-0.075);
        chai.expect(round(result[612])).to.equal(-0.037);
        chai.expect(round(result[614])).to.equal(0);
        chai.expect(round(result[617])).to.equal(-0.09);
        chai.expect(round(result[619])).to.equal(-0.15);
        chai.expect(round(result[622])).to.equal(-0.06);
    });
});

function round(x : number) : number {
    return Math.round(x*1000)/1000;
}