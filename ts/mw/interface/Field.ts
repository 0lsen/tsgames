export interface Field {
    click(x: number, y: number, check: boolean): void
    view(): number[]
    isDefeated(): boolean
    isComplete(): boolean
}