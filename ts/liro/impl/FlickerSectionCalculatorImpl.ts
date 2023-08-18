import {FlickerSectionCalculator} from "../interface/FlickerSectionCalculator";
import {Randomizer} from "../../core/interface/Randomizer";

export class FlickerSectionCalculatorImpl implements FlickerSectionCalculator {

    private readonly calmSectionMinLength = 300;
    private readonly calmSectionMaxLength = 800;
    private readonly calmSectionMinSpikes = 4;
    private readonly calmSectionMaxSpikes = 10;
    private readonly calmSectionMaxDeviation = 0.075;
    private readonly flickerSectionMinLength = 10;
    private readonly flickerSectionMaxLength = 30;
    private readonly flickerSectionMinSpikes = 2;
    private readonly flickerSectionMaxSpikes = 4;
    private readonly flickerSectionMaxDeviation = 0.15;

    private readonly randomizer : Randomizer;

    constructor(randomizer: Randomizer) {
        this.randomizer = randomizer;
    }

    createSection(): number[] {
        // a couple of sinus waves to indicate pulsating light source
        let sign = this.randomizer.randomBool() ? 1 : -1;
        let sectionLength = this.randomizer.randomInt(this.calmSectionMaxLength-this.calmSectionMinLength)+this.calmSectionMinLength;
        let sectionSpikes = this.randomizer.randomInt(this.calmSectionMaxSpikes-this.calmSectionMinSpikes)+this.calmSectionMinSpikes;
        let sectionDeviation = this.calmSectionMaxDeviation*this.randomizer.randomInt(100)/100;
        let values : number[] = [];
        for (let i = 0; i < sectionLength; i++) {
            values.push(sign * sectionDeviation*Math.sin(sectionSpikes*Math.PI*i/sectionLength));
        }

        // a couple of short negative zig zags to indicate flickering
        sectionSpikes = this.randomizer.randomInt(this.flickerSectionMaxSpikes-this.flickerSectionMinSpikes)+this.flickerSectionMinSpikes;
        for (let j = 0; j < sectionSpikes; j++) {
            sectionLength = (this.randomizer.randomInt(this.flickerSectionMaxLength-this.flickerSectionMinLength)+this.flickerSectionMinLength)/sectionSpikes;
            sectionDeviation = this.flickerSectionMaxDeviation*this.randomizer.randomInt(100)/100;
            for (let i = 0; i < sectionLength; i++) {
                values.push(-sectionDeviation*(2*Math.abs(i/sectionLength-Math.floor(i/sectionLength+0.5))));
            }
        }

        return values;
    }
}