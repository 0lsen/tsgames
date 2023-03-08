import {RandomizerMock} from "../core/RandomizerMock";
import {ProbabilityBasedOpponent} from "../../ts/bs/impl/opponent/ProbabilityBasedOpponent";
import {HeatMapperImpl} from "../../ts/bs/impl/HeatMapperImpl";
import {SpaceCalculatorImpl} from "../../ts/bs/impl/SpaceCalculatorImpl";

const chai = require('chai');
const mocha = require('mocha');

const randomizer = new RandomizerMock();


const spaceCalc = new SpaceCalculatorImpl();
const opponent = new ProbabilityBasedOpponent(randomizer, new HeatMapperImpl(spaceCalc), spaceCalc);

mocha.describe('BS ProbabilityBasedOpponent', () => {
    mocha.it('TODO', () => {
    });
});