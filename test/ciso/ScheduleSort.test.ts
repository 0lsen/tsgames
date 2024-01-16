import {RandomizerImpl} from "../../ts/core/impl/RandomizerImpl";
import {ScheduleSort} from "../../ts/ciso/impl/ScheduleSort";

const chai = require('chai');
const mocha = require('mocha');

mocha.describe('CiSo ScheduleSort', () => {
    mocha.it('sorts 100 random entries', (done : Function) => {
        const timeoutMultiplier = 5;
        ScheduleSort.timeoutMultiplier = timeoutMultiplier;
        const randomizer = new RandomizerImpl();
        const values = Array(100).fill(0).map(v => randomizer.randomInt(100));
        const sort = new ScheduleSort(values);

        setTimeout( () => {
            chai.expect(sort.getValues()).to.deep.equal(values.sort((v1, v2) => v1-v2));
            done();
        }, timeoutMultiplier*101);
    });
});