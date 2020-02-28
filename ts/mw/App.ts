import {Settings} from "./Settings";
import {FieldImpl} from "./impl/FieldImpl";
import {Field} from "./interface/Field";
import {BaseApp} from "../core/BaseApp";
import ClickEvent = JQuery.ClickEvent;
import ContextMenuEvent = JQuery.ContextMenuEvent;

export class App extends BaseApp {

    private readonly CLASS_MARKED   = 'marked';
    private readonly CLASS_REVEALED = 'revealed';

    private settings: Settings;
    private field: Field;
    private marked: number[];
    private started: boolean;
    private timer: number;

    private $board =    $('#board');
    private $width =    $('#width');
    private $height =   $('#height');
    private $mines =    $('#mines');
    private $time =     $('#time');
    private $minesR     =$('#minesRemaining');

    constructor() {
        super();
        this.reset();
        this.$resetButton.on('click', () => this.reset());
        this.runTimer();
    }

    reset(): void {
        let width = parseInt(this.$width.val().toString());
        let height = parseInt(this.$height.val().toString());
        let mines = parseInt(this.$mines.val().toString());

        if (width < 1 || height < 1 || mines < 0 || mines > width*height-1 ) {
            this.overlay("ERROR");
            return;
        }

        this.settings = new Settings(width, height, mines);
        this.started = false;
        this.timer = null;
        this.marked = [];
        this.$time.val('0 s');
        this.$minesR.val(this.settings.MINES);
        this.buildBoard();
    }

    private buildBoard() {
        this.$board.empty();
        if (!this.started) {
            for (let i=0; i < this.settings.HEIGHT; i++) {
                let $line = $('<div></div>');
                for (let j=0; j < this.settings.WIDTH; j++) {
                    $line.append($('<div id="f'+i+'-'+j+'"></div>'));
                }
                this.$board.append($line);
            }
        } else {
            let view = this.field.view();
            for (let i=0; i < this.settings.HEIGHT; i++) {
                let $line = $('<div></div>');
                for (let j=0; j < this.settings.WIDTH; j++) {
                    let $element = $('<div id="f'+i+'-'+j+'"></div>');
                    let value = view[i*this.settings.WIDTH+j];
                    if (value === null) $element.addClass('mine');
                    if (value !== null && value > -1) $element.addClass(this.CLASS_REVEALED+' value'+value);
                    if (value !== null && value > 0) $element.text(value);
                    if (this.marked.indexOf(i*this.settings.WIDTH+j) != -1) $element.addClass(this.CLASS_MARKED);
                    $line.append($element);
                }
                this.$board.append($line);
            }
        }
        this.$board.find(' > div > div').on('click', e => this.click(e));
        this.$board.find(' > div > div').on('contextmenu', e => this.mark(e));
    }

    private click(e: ClickEvent): void {
        let $target = $(e.target);
        if ($target.hasClass('marked')) return;
        let coords = this.coords($target);
        if (this.started) {
            this.field.click(coords[0], coords[1], true);
        } else {
            this.field = new FieldImpl(this.randomizer, this.settings, coords[0], coords[1]);
            this.started = true;
            this.timer = performance.now();
        }
        if (this.field.isDefeated()) {
            this.timer = null;
            this.overlay('YOU FAILED.');
        }
        if (this.field.isComplete()) {
            this.timer = null;
            this.overlay('YOU WON!');
        }
        this.buildBoard();
    }

    private mark(e: ContextMenuEvent): void {
        e.preventDefault();
        let $target = $(e.target);
        if (!$target.hasClass(this.CLASS_REVEALED)) {
            let coords = this.coords($target);
            let index = coords[1]*this.settings.WIDTH+coords[0];
            if ($target.hasClass(this.CLASS_MARKED)) {
                this.marked.splice(this.marked.indexOf(index), 1);
            } else {
                this.marked.push(index);
            }
            $target.toggleClass(this.CLASS_MARKED);
        }
        this.$minesR.val(this.settings.MINES-$('.'+this.CLASS_MARKED).length);
    }

    private coords($target: JQuery): number[] {
        let id = $target.prop('id');
        let coords = id.substr(1).split('-');
        return [parseInt(coords[1]), parseInt(coords[0])];
    }

    private runTimer() {
        if (this.timer !== null) {
            this.$time.val(Math.round((performance.now()-this.timer)/100)/10 + ' s');
        }
        setTimeout(() => this.runTimer(), 100);
    }
}