import {HeatMapperImpl} from "../../ts/bs/impl/HeatMapperImpl";
import {SpaceCalculatorImpl} from "../../ts/bs/impl/SpaceCalculatorImpl";
import {HitMapBuilder} from "./HitMapBuilder";
import {ThisShouldNeverHappenException} from "../../ts/core/exception/ThisShouldNeverHappenException";
import {HeatMap} from "../../ts/bs/model/HeatMap";

const chai = require('chai');
const mocha = require('mocha');

const minLength = 3;
const maxLength = 5;

const mapper = new HeatMapperImpl(new SpaceCalculatorImpl());

let hitmap = HitMapBuilder.build();

mocha.describe('BS HeatMapper', () => {
    let heatMap : HeatMap;

    mocha.it('builds without failure', () => {
        chai.expect(() => heatMap = mapper.build(hitmap, minLength, maxLength)).to.not.throw();
    });

    mocha.it('maps examples correctly', () => {
        chai.expect(heatMap.getHeat()[heatMap.findIndex(0,0)]).to.equal(50);
        chai.expect(heatMap.getHeat()[heatMap.findIndex(5,4)]).to.equal(162);
        chai.expect(heatMap.getHeat()[heatMap.findIndex(6,4)]).to.equal(80);
        chai.expect(heatMap.getHeat()[heatMap.findIndex(7,2)]).to.equal(74);
        chai.expect(heatMap.getHeat()[heatMap.findIndex(4,9)]).to.equal(49);
        chai.expect(heatMap.getHeat()[heatMap.findIndex(8,9)]).to.equal(25);
        chai.expect(heatMap.getHeat()[heatMap.findIndex(6,8)]).to.equal(34);

        chai.expect(() => heatMap.getHeat().at(heatMap.findIndex(2,6))).to.throw(ThisShouldNeverHappenException);
    });
});