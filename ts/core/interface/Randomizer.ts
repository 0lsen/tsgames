export interface Randomizer {
    randomInt(max: number): number
    randomIntBetween(min : number, max : number): number
    randomGaussian(mean : number, stdev : number): number
    randomBool(): boolean
    randomEnum<T>(e:T): T[keyof T]
    randomListEntry<T>(list: T[]) : T
}