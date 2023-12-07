import {Settings} from "./Settings";
import {FieldImpl} from "./impl/FieldImpl";
import {Field} from "./interface/Field";
import {BaseApp} from "../core/BaseApp";
import {Record} from "./model/Record";
import ClickEvent = JQuery.ClickEvent;
import ContextMenuEvent = JQuery.ContextMenuEvent;

export class App extends BaseApp {

    private readonly CLASS_MARKED   = 'marked';
    private readonly CLASS_REVEALED = 'revealed';
    private readonly RECORD_SEPARATOR = ';';
    private readonly STORAGE_KEY = 'tsgames-mw';

    private settings: Settings;
    private field: Field;
    private marked: number[];
    private started: boolean;
    private timer: number;
    private records: Record[];

    private $board =    $('#board');
    private $width =    $('#width');
    private $height =   $('#height');
    private $mines =    $('#mines');
    private $time =     $('#time');
    private $minesR     =$('#minesRemaining');

    private width: number;
    private height: number;
    private mines: number;

    constructor() {
        super();
        this.reset();
        this.$resetButton.on('click', () => this.reset());
        this.runTimer();
        this.fetchRecords();
    }

    reset(): void {
        this.width = this.getWidth();
        this.height = this.getHeight();
        this.mines = this.getMines();

        if (this.width < 1 || this.height < 1 || this.mines < 0 || this.mines > this.width*this.height-1 ) {
            this.overlay("ERROR");
            return;
        }

        this.settings = new Settings(this.width, this.height, this.mines);
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
                const $line = $('<div></div>');
                for (let j=0; j < this.settings.WIDTH; j++) {
                    $line.append($('<div id="f'+i+'-'+j+'"></div>'));
                }
                this.$board.append($line);
            }
        } else {
            const view = this.field.view();
            for (let i=0; i < this.settings.HEIGHT; i++) {
                const $line = $('<div></div>');
                for (let j=0; j < this.settings.WIDTH; j++) {
                    const $element = $('<div id="f'+i+'-'+j+'"></div>');
                    const value = view[i*this.settings.WIDTH+j];
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
        const $target = $(e.target);
        if ($target.hasClass('marked')) return;
        const coords = this.coords($target);
        if (this.started) {
            this.field.click(coords[0], coords[1], true);
        } else {
            this.field = new FieldImpl(this.randomizer, this.settings, coords[0], coords[1]);
            this.started = true;
            this.timer = performance.now();
        }
        if (this.field.isDefeated()) {
            this.timer = null;
            this.end(false);
        }
        if (this.field.isComplete()) {
            this.timer = null;
            this.end(true);
        }
        this.buildBoard();
    }

    private mark(e: ContextMenuEvent): void {
        e.preventDefault();
        const $target = $(e.target);
        if (!$target.hasClass(this.CLASS_REVEALED)) {
            const coords = this.coords($target);
            const index = coords[1]*this.settings.WIDTH+coords[0];
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
        const id = $target.prop('id');
        const coords = id.substr(1).split('-');
        return [parseInt(coords[1]), parseInt(coords[0])];
    }

    private runTimer(): void {
        if (this.timer !== null) {
            this.$time.val(Math.round((performance.now()-this.timer)/100)/10 + ' s');
        }
        setTimeout(() => this.runTimer(), 100);
    }

    private getWidth(): number {
        return this.parseInt(this.$width);
    }

    private getHeight(): number {
        return this.parseInt(this.$height);
    }

    private getMines(): number {
        return this.parseInt(this.$mines);
    }

    private parseInt(field: JQuery): number {
        return parseInt(field.val().toString());
    }

    private end(win: boolean): void {
        let text = "YOU " + (win ? "WON!" : "FAILED.")+ "<br/><br/>";
        if (win) {
            const timeString = this.$time.val().toString();
            const time = parseFloat(timeString.substr(0, timeString.length-2));
            this.setRecord(time);
            text += "Your time: " + time + "<br/>";
        }
        const record = this.getRecord();
        text += "Personal best: " + (record ? record.value : "-");
        this.overlay(text);
    }

    private fetchRecords(): void {
        const string = localStorage.getItem(this.STORAGE_KEY);
        this.records = string ? string.split(this.RECORD_SEPARATOR).map(s => new Record(s)) : [];
    }

    private setRecord(time: number): void {
        const existingRecord = this.getRecord();
        if (existingRecord && existingRecord.value > time) {
             existingRecord.value = time;
        } else {
            this.records.push(new Record(this.getRecordKey()+Record.SEPARATOR+time));
        }
        this.storeRecords();
    }

    private getRecord(): Record {
        return this.records.find(r => r.key === this.getRecordKey());
    }

    private getRecordKey(): string {
        return "r"+Math.min(this.width, this.height)+"x"+Math.max(this.width, this.height)+"x"+this.mines;
    }

    private storeRecords(): void {
        localStorage.setItem(this.STORAGE_KEY, this.records.map(r => r.toString()).join(this.RECORD_SEPARATOR));
    }
}