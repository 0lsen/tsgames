export interface Randomizer {
    randomInt(max: number): number
    randomBool(): boolean
    randomEnum<T>(e:T): T[keyof T]
}