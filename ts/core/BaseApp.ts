import {Randomizer} from "./interface/Randomizer";
import {RandomizerImpl} from "./impl/RandomizerImpl";

export abstract class BaseApp {
    protected $overlay = $('#overlay');
    protected $resetButton = $('#reset');
    protected randomizer: Randomizer;

    constructor() {
        this.randomizer = new RandomizerImpl();
        this.$overlay.hide();
        this.$overlay.on('click', () => this.$overlay.hide());
        this.$overlay.find('>div').on('click', (e) => e.stopPropagation());
    }

    protected overlay(text): void {
        this.$overlay.find('>div').text(text);
        this.$overlay.show();
    }
}