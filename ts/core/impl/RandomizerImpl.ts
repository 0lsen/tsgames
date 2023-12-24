import {Randomizer} from "../interface/Randomizer";

export class RandomizerImpl implements Randomizer {
    randomInt(max: number): number {
        return Math.floor(Math.random()*max);
    }

    randomIntBetween(min: number, max: number): number {
        return this.randomInt(max-min)+min;
    }

    // see: https://stackoverflow.com/questions/25582882/javascript-math-random-normal-distribution-gaussian-bell-curve
    randomGaussian(mean : number = 0, stdev : number = 1): number {
        let u = 1 - Math.random();
        let v = Math.random();
        let z = Math.sqrt( -2.0 * Math.log( u ) ) * Math.cos( 2.0 * Math.PI * v );
        return z * stdev + mean;
    }

    randomBool(): boolean {
        return Math.round(Math.random()) < 0.5;
    }

    randomEnum<T>(e: T): T[keyof T] {
        const values = Object.keys(e)
            .map(n => Number.parseInt(n))
            .filter(n => !Number.isNaN(n)) as unknown as T[keyof T][];
        return values[Math.floor(Math.random() * values.length)];
    }

    randomListEntry<T>(list: T[]) : T {
        if (!list.length) throw new Error();
        return list[this.randomInt(list.length)];
    }
}