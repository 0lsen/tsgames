export abstract class Ship {

    private sunk: boolean = false;

    public sink() {
        this.sunk = true;
    }

    public isSunk(): boolean {
        return this.sunk;
    }
}