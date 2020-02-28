export class Settings {
    public readonly WIDTH;
    public readonly HEIGHT;
    public readonly MINES;

    constructor(WIDTH, HEIGHT, MINES) {
        this.WIDTH = WIDTH;
        this.HEIGHT = HEIGHT;
        this.MINES = MINES;
    }
}