import {VelocityCalculatorImpl} from "../../ts/cadi/impl/VelocityCalculatorImpl";
import {Coord} from "../../ts/cadi/model/Coord";

const chai = require('chai');
const mocha = require('mocha');

const calculator = new VelocityCalculatorImpl();

mocha.describe('Canvas Velocity Calc', () => {

    mocha.it('ignores certain data points', () => {
        let result = calculator.calc([
            new Coord(0, 0, 99),
            new Coord(20, 20, 200),
            new Coord(30, 30, 210),
            new Coord(40, 40, 220),
            new Coord(50, 50, 230),
            new Coord(40, 40, 240),
            new Coord(50, 50, 250),
            new Coord(60, 60, 260),
            new Coord(70, 70, 270),
            new Coord(80, 80, 280),
            new Coord(90, 90, 290),
            new Coord(100, 100, 300),
        ]);

        chai.expect(result.x).to.equal(50);
        chai.expect(result.y).to.equal(50);

        result = calculator.calc([
            new Coord(100, 100, 200),
            new Coord(90, 90, 210),
            new Coord(80, 80, 220),
            new Coord(90, 90, 230),
            new Coord(80, 80, 240),
            new Coord(70, 70, 250),
            new Coord(60, 60, 260),
            new Coord(50, 50, 270),
            new Coord(40, 40, 280),
            new Coord(30, 30, 290),
            new Coord(20, 20, 300),
        ]);

        chai.expect(result.x).to.equal(-50);
        chai.expect(result.y).to.equal(-50);
    });

    mocha.it('needs enough data', () => {
        const data = [
            new Coord(10, 10, 200),
            new Coord(20, 20, 210),
            new Coord(30, 30, 220),
            new Coord(40, 40, 230),
            new Coord(50, 50, 240),
            new Coord(60, 60, 250),
            new Coord(70, 70, 260),
            new Coord(80, 80, 270),
            new Coord(90, 90, 280),
            new Coord(100, 100, 290),
        ];
        chai.expect(calculator.calc(data)).to.be.null;

        data.push(new Coord(110, 110, 290));
        chai.expect(calculator.calc(data)).to.be.null;
    });

    mocha.it('has max velocity', () => {
        const result = calculator.calc([
            new Coord(10000, -10000, 200),
            new Coord(20000, -20000, 210),
            new Coord(30000, -30000, 220),
            new Coord(40000, -40000, 230),
            new Coord(50000, -50000, 240),
            new Coord(60000, -60000, 250),
            new Coord(70000, -70000, 260),
            new Coord(80000, -80000, 270),
            new Coord(90000, -90000, 280),
            new Coord(100000, -100000, 290),
            new Coord(110000, -110000, 300),
        ]);

        chai.expect(result.x).to.equal(100);
        chai.expect(result.y).to.equal(-100);
    });
});