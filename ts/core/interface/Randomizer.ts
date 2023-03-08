export interface Randomizer {
    randomInt(max: number): number
    randomGaussian(mean : number, stdev : number): number
    randomBool(): boolean
    randomEnum<T>(e:T): T[keyof T]
}