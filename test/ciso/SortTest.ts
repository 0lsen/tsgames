import {Pillar} from "../../ts/ciso/model/Pillar";
import {RandomizerImpl} from "../../ts/core/impl/RandomizerImpl";
import {SortConstructor} from "../../ts/ciso/interface/SortConstructor";

const chai = require('chai');
const mocha = require('mocha');

export class SortTest {

    private readonly algorithm : SortConstructor;

    constructor(algorithm: SortConstructor) {
        this.algorithm = algorithm;
    }

    public runTests(expectedIterations : number[][]) : void {
        mocha.describe('CiSo ' + new this.algorithm([]).constructor.name, () => {
            mocha.it('sorts 1-4 entries', () => {
                this.executeTest([], expectedIterations[0][0], []);

                this.executeTest([1], expectedIterations[0][1], [1]);

                this.executeTest([1, 2], expectedIterations[1][0], [1, 2]);
                this.executeTest([2, 1], expectedIterations[1][1], [1, 2]);

                this.executeTest([1, 2, 3], expectedIterations[2][0], [1, 2, 3]);
                this.executeTest([1, 3, 2], expectedIterations[2][1], [1, 2, 3]);
                this.executeTest([2, 1, 3], expectedIterations[2][2], [1, 2, 3]);
                this.executeTest([2, 3, 1], expectedIterations[2][3], [1, 2, 3]);
                this.executeTest([3, 1, 2], expectedIterations[2][4], [1, 2, 3]);
                this.executeTest([3, 2, 1], expectedIterations[2][5], [1, 2, 3]);

                this.executeTest([1, 2, 3, 4], expectedIterations[3][0], [1, 2, 3, 4]);
                this.executeTest([1, 2, 4, 3], expectedIterations[3][1], [1, 2, 3, 4]);
                this.executeTest([1, 3, 2, 4], expectedIterations[3][2], [1, 2, 3, 4]);
                this.executeTest([1, 3, 4, 2], expectedIterations[3][3], [1, 2, 3, 4]);
                this.executeTest([1, 4, 2, 3], expectedIterations[3][4], [1, 2, 3, 4]);
                this.executeTest([1, 4, 3, 2], expectedIterations[3][5], [1, 2, 3, 4]);

                this.executeTest([2, 1, 3, 4], expectedIterations[3][6], [1, 2, 3, 4]);
                this.executeTest([2, 1, 4, 3], expectedIterations[3][7], [1, 2, 3, 4]);
                this.executeTest([2, 3, 1, 4], expectedIterations[3][8], [1, 2, 3, 4]);
                this.executeTest([2, 3, 4, 1], expectedIterations[3][9], [1, 2, 3, 4]);
                this.executeTest([2, 4, 1, 3], expectedIterations[3][10], [1, 2, 3, 4]);
                this.executeTest([2, 4, 3, 1], expectedIterations[3][11], [1, 2, 3, 4]);

                this.executeTest([3, 1, 2, 4], expectedIterations[3][12], [1, 2, 3, 4]);
                this.executeTest([3, 1, 4, 2], expectedIterations[3][13], [1, 2, 3, 4]);
                this.executeTest([3, 2, 1, 4], expectedIterations[3][14], [1, 2, 3, 4]);
                this.executeTest([3, 2, 4, 1], expectedIterations[3][15], [1, 2, 3, 4]);
                this.executeTest([3, 4, 1, 2], expectedIterations[3][16], [1, 2, 3, 4]);
                this.executeTest([3, 4, 2, 1], expectedIterations[3][17], [1, 2, 3, 4]);

                this.executeTest([4, 1, 2, 3], expectedIterations[3][18], [1, 2, 3, 4]);
                this.executeTest([4, 1, 3, 2], expectedIterations[3][19], [1, 2, 3, 4]);
                this.executeTest([4, 2, 1, 3], expectedIterations[3][20], [1, 2, 3, 4]);
                this.executeTest([4, 2, 3, 1], expectedIterations[3][21], [1, 2, 3, 4]);
                this.executeTest([4, 3, 1, 2], expectedIterations[3][22], [1, 2, 3, 4]);
                this.executeTest([4, 3, 2, 1], expectedIterations[3][23], [1, 2, 3, 4]);
            });

            mocha.it('sorts 100 random entries', () => {
                const randomizer = new RandomizerImpl();
                const pillars = Array(100).fill(0).map(v => new Pillar(randomizer.randomInt(100)));
                const sort = new this.algorithm(pillars);
                while (!sort.isSorted()) {
                    sort.iterate();
                }
                chai.expect(sort.getState().map(p => p.height)).to.deep.equal(pillars.sort((p1, p2) => p1.height - p2.height).map(p => p.height));
            });
        });
    }
    
    private executeTest(input : number[], iterations : number, expected : number[]) {
        const sort = new this.algorithm(input.map(n => new Pillar(n)));
        for (let i = 0; i < iterations; i++) {
            chai.expect(sort.isSorted()).to.be.false;
            sort.iterate();
        }
        chai.expect(sort.isSorted()).to.be.true;
        chai.expect(sort.getState().length).to.equal(expected.length);
        chai.expect(sort.getState().map(p => p.height)).to.deep.equal(expected);
    }
}