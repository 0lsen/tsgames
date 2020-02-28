import {Randomizer} from "../interface/Randomizer";

export class RandomizerImpl implements Randomizer {
    randomInt(max: number): number {
        return Math.floor(Math.random()*max);
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
}