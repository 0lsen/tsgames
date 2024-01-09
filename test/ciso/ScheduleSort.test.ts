import {RandomizerImpl} from "../../ts/core/impl/RandomizerImpl";
import {Pillar} from "../../ts/ciso/model/Pillar";
import {ScheduleSort} from "../../ts/ciso/impl/ScheduleSort";

const chai = require('chai');
const mocha = require('mocha');

mocha.describe('CiSo ScheduleSort', () => {
    mocha.it('sorts 100 random entries', (done : Function) => {
        const timeoutMultiplier = 5;
        ScheduleSort.timeoutMultiplier = timeoutMultiplier;
        const randomizer = new RandomizerImpl();
        const pillars = Array(100).fill(0).map(v => new Pillar(randomizer.randomInt(100)));
        const sort = new ScheduleSort(pillars);

        setTimeout( () => {
            chai.expect(sort.getState().map(p => p.height)).to.deep.equal(pillars.sort((p1, p2) => p1.height - p2.height).map(p => p.height));
            done();
        }, timeoutMultiplier*101);
    });
});