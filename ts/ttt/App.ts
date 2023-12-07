import {BaseApp} from "../core/BaseApp";
import {GameState} from "./GameState";
import {SmartOpponent} from "./opponent/SmartOpponent";
import {DumbOpponent} from "./opponent/DumbOpponent";
import {Opponent} from "./opponent/Opponent";

export class App extends BaseApp {

    private opponent : Opponent;

    private readonly dumbOpponent : DumbOpponent;
    private readonly smartOpponent : SmartOpponent;

    private readonly $tiles = $('#board > div');
    private readonly $info = $('#info');
    private readonly $invincible = $('#invincible');

    private state : GameState;

    private playerStartTurn : boolean = true;
    private playerTurn : boolean = true;

    constructor() {
        super();
        this.dumbOpponent = new DumbOpponent(this.randomizer);
        this.smartOpponent = new SmartOpponent(this.randomizer);
        this.setOpponent();
        this.state = new GameState();
        this.$tiles.on('click', e => this.handleClick(e));
        this.$invincible.on('click', () => this.setOpponent());
        this.drawBoard();
    }

    private handleClick(e) : void {
        if (this.state.isFull() || this.state.hasWon() !== undefined) {
            this.playerStartTurn = !this.playerStartTurn;
            this.playerTurn = this.playerStartTurn;
            this.state = new GameState(undefined, this.playerStartTurn);
            this.drawBoard();
            return;
        }
        if (this.playerTurn) {
            const $tile = $(e.target);
            let index: number;
            for (let i = 0; i < this.$tiles.length; i++) {
                if ($tile.is(this.$tiles[i])) {
                    index = i;
                    break;
                }
            }
            if (index !== undefined) {
                this.state.play(index);
                this.playerTurn = false;
            }
        } else {
            this.opponent.makeMove(this.state);
            this.playerTurn = true;
        }

        this.drawBoard();
    }

    private setOpponent() : void {
        this.opponent = this.$invincible.prop('checked') ? this.smartOpponent : this.dumbOpponent;
    }

    private drawBoard() : void {
        this.$tiles.removeClass('far fa-circle fas fa-xmark win');
        let infoText;
        if (this.state.hasWon() !== undefined) {
            infoText = (this.state.hasWon() ? 'Player' : 'Opponent')+'\ has won.';
            this.state.getWinLine().forEach(i => this.$tiles.eq(i).addClass('win'));
        } else if (this.state.isFull()) {
            infoText = 'It\'s a draw.';
        } else {
            infoText = (this.playerTurn ? 'Player' : 'Opponent')+'\'s turn.';
        }
        this.$info.text(infoText);

        const state = this.state.state;

        state.forEach((player, index) => {
            if (player === true) {
                $(this.$tiles[index]).addClass('fas fa-xmark');
            } else if (player === false) {
                $(this.$tiles[index]).addClass('far fa-circle');
            }
        })
    }
}