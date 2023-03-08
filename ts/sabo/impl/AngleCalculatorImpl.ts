import {AngleCalculator} from "../interface/AngleCalculator";

export class AngleCalculatorImpl implements AngleCalculator {

    private readonly width : number;
    private readonly profile : number[];
    private angleDetectionRange : number;

    constructor(width: number, profile: number[]) {
        this.width = width;
        this.profile = profile;
    }

    calcAngle(x: number, left: boolean): number | undefined {
        if (!this.profile[x] || (left && !x) || (!left && x == this.width-1)) return undefined;

        let i = 1;
        let y = undefined;

        while (
            i <= this.angleDetectionRange &&
            ((left && x - i >= 0) || (!left && x + i < this.width)) &&
            this.profile[left ? x-i : x+i] <= this.profile[left ? x-i+1 : x+i-1] - (i == 1 ? 1 : 0)
            ) {
            y = this.profile[x] - 1 - this.profile[left ? x-i : x+i];
            i++;
        }
        return y === undefined ? undefined : this.radToDeg(Math.atan2(y, i-1));
    }

    setAngleOfRepose(angle: number): void {
        for (let i = 1; i <= this.width ; i++) {
            if (this.radToDeg(Math.acos(2*i*i/(2*i*Math.sqrt(i*i+1)))) < angle) {
                this.angleDetectionRange = i;
                break;
            }
        }
        if (!this.angleDetectionRange) {
            this.angleDetectionRange = this.width;
        }
    }

    private radToDeg(rad : number) : number {
        return rad*180/Math.PI;
    }
}