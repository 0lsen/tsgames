import {BaseApp} from "../core/BaseApp";
import {Status} from "./enum/Status";

export class App extends BaseApp {

    private readonly CLASS_ACTIVE = 'active';

    private readonly $table = $('#board table');
    private readonly $width = $('#width');
    private readonly $height = $('#height');
    private readonly $tick = $('#tick');

    private readonly $setSizeButton = $('#setSize');
    private readonly $setTickButton = $('#setTick');
    private readonly $goButton = $('#go');
    private readonly $stopButton = $('#stop');
    private readonly $status = $('#status');

    private width : number;
    private height : number;
    private tickDelay : number;
    private isRunning : boolean = false;
    private iteration : number;
    private startState : boolean[];
    private previousState : boolean[];
    private previousPreviousState : boolean[];

    constructor() {
        super();
        this.$setSizeButton.on('click', () => this.setSize());
        this.$setTickButton.on('click', () => this.setTick());
        this.$goButton.on('click', () => this.go());
        this.$stopButton.on('click', () => this.stop());
        this.$resetButton.on('click', () => this.reset());
        this.setSize();
    }

    private setSize() : void {
        this.isRunning = false;
        this.startState = [];
        this.iteration = 0;
        this.$table.empty();
        this.width = this.getWidth();
        this.height = this.getHeight();
        if (!this.tickDelay) {
            this.tickDelay = this.getTick();
        }
        for (let i = 0; i < this.height; i++) {
            let $tr = $('<tr></tr>');
            for (let j = 0; j < this.width; j++) {
                let $td = $('<td></td>');
                $td.on('click', (e) => {
                    this.setActive($td, !this.isActive($td));
                });
                $tr.append($td);
            }
            this.$table.append($tr);
        }
    }

    private setTick() : void {
        this.tickDelay = this.getTick();
    }

    private go() : void {
        if (this.isRunning) return;

        this.isRunning = true;
        let $tds = this.getTds();
        if (this.iteration === 0) {
            this.startState = [];
            for (let i = 0; i < $tds.length; i++) {
                this.startState.push(this.isActive($tds[i]));
            }
        }
        this.tick($tds);
    }

    private stop() : void {
        this.isRunning = false;
        this.status(Status.STOPPED);
    }

    private reset() : void {
        if (!this.startState.length) return;

        this.isRunning = false;
        this.iteration = 0;
        let $tds = this.getTds();
        for (let i = 0; i < $tds.length; i++) {
            this.setActive($tds[i], this.startState[i]);
        }
    }

    private getWidth() : number {
        return this.parseInt(this.$width);
    }

    private getHeight() : number {
        return this.parseInt(this.$height);
    }

    private getTick() : number {
        return this.parseInt(this.$tick);
    }

    private getTds() : JQuery<JQuery> {
        return this.$table.find('td').map((i, e) => $(e));
    }

    private parseInt(field: JQuery) : number {
        return parseInt(field.val().toString());
    }

    private isActive($td : JQuery) : boolean {
        return $td.hasClass(this.CLASS_ACTIVE);
    }
    private setActive($td : JQuery, active : boolean) : void {
        if (active) {
            $td.addClass(this.CLASS_ACTIVE);
        } else {
            $td.removeClass(this.CLASS_ACTIVE);
        }
    }

    private tick($tds : JQuery<JQuery>) : void {
        if (!this.isRunning) return;

        this.iteration++;
        let state = [];
        for (let i = 0; i < $tds.length; i++) {
            let active = this.isActive($tds[i]);
            let no = this.activeNeighbours($tds, i);
            if (no < 2 && active) {
                active = false;
            } else if (no < 4 && active) {
                active = true;
            } else if (no > 3 && active) {
                active = false;
            } else if (no === 3 && !active) {
                active = true;
            }
            state.push(active);
        }
        for (let i = 0; i < $tds.length; i++) {
            this.setActive($tds[i], state[i]);
        }
        if (this.previousState && state.every((v, i) => v === this.previousState[i])) {
            this.isRunning = false;
            this.status(Status.STATIC);
        } else {
            if(this.previousPreviousState && state.every((v, i) => v === this.previousPreviousState[i])) {
                this.status(Status.PERIODIC);
            } else {
                this.status(Status.RUNNING);
            }
            this.previousPreviousState = this.previousState;
            this.previousState = state;
            setTimeout(() => {
                this.tick($tds);
            }, this.tickDelay);
        }
    }

    private activeNeighbours(tds : JQuery<JQuery>, index : number) : number {
        let row = Math.floor(index/this.width);
        let col = index - row*this.width;

        let ul = (row ? row-1 : this.height-1)*this.width + (col ? col-1 : this.width-1);
        let um = (row ? row-1 : this.height-1)*this.width + col;
        let ur = (row ? row-1 : this.height-1)*this.width + (col < this.width-1 ? col+1 : 0);
        let cr = row*this.width + (col < this.width-1 ? col+1 : 0);
        let br = (row < this.height-1 ? row+1 : 0)*this.width + (col < this.width-1 ? col+1 : 0);
        let bm = (row < this.height-1 ? row+1 : 0)*this.width + col;
        let bl = (row < this.height-1 ? row+1 : 0)*this.width + (col ? col-1 : this.width-1);
        let cl = row*this.width + (col ? col-1 : this.width-1);

        let no = 0;
        if (this.isActive(tds[ul])) no++;
        if (this.isActive(tds[um])) no++;
        if (this.isActive(tds[ur])) no++;
        if (this.isActive(tds[cr])) no++;
        if (this.isActive(tds[br])) no++;
        if (this.isActive(tds[bm])) no++;
        if (this.isActive(tds[bl])) no++;
        if (this.isActive(tds[cl])) no++;

        return no;
    }

    private status(status : Status) : void {
        let it = this.iteration.toString();
        while(/(\d)(\d{3})(?=\.|$)/.test(it)) {
            it = it.replace(/(\d)(\d{3})(?=\.|$)/, '$1.$2');
        }
        this.$status.text(status+' at iteration '+it);
    }
}