export class Record {
    public static readonly SEPARATOR = "=";

    readonly key: string;
    value: number;

    constructor(string: string) {
        let parts = string.split(Record.SEPARATOR);
        this.key = parts[0];
        this.value = parseFloat(parts[1]);
    }

    toString(): string {
        return this.key+Record.SEPARATOR+this.value;
    }
}