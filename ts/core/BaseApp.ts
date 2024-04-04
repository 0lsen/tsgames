import {Randomizer} from "./interface/Randomizer";
import {RandomizerImpl} from "./impl/RandomizerImpl";

export abstract class BaseApp {
    protected $overlay = $('#overlay');
    protected $overlayReset = $('#overlayReset');
    protected $resetButton = $('#reset');
    protected randomizer: Randomizer;

    constructor() {
        this.randomizer = new RandomizerImpl();
        this.$overlay.hide();
        this.$overlay.on('click', () => this.$overlay.hide());
        this.$overlay.find('>div').on('click', (e) => e.stopPropagation());
        this.$overlayReset.on('click', () => this.$overlay.hide());
    }

    protected overlay(html : string): void {
        this.$overlay.find('.card > div').html(html);
        this.$overlay.show();
    }
}