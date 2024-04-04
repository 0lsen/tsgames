import {State} from "./model/State";
import {Phase} from "./enum/Phase";
import {Game} from "./interface/Game";
import {GameImpl} from "./impl/GameImpl";
import {Settings} from "./Settings";
import {ShipArrangement} from "./model/ShipArrangement";
import {Carrier} from "./model/ship/Carrier";
import {Battleship} from "./model/ship/Battleship";
import {Destroyer} from "./model/ship/Destroyer";
import {Patrol} from "./model/ship/Patrol";
import {Orientation} from "../core/enum/Orientation";
import {Helper} from "./Helper";
import {Coord} from "./model/Coord";
import {SpaceCalculatorImpl} from "./impl/SpaceCalculatorImpl";
import {RandomOpponent} from "./impl/opponent/RandomOpponent";
import {ProbabilityBasedOpponent} from "./impl/opponent/ProbabilityBasedOpponent";
import {HeatMapperImpl} from "./impl/HeatMapperImpl";
import {Turn} from "./enum/Turn";
import {HitMap} from "./model/HitMap";
import {Setup} from "./model/Setup";
import {IShip} from "./interface/IShip";
import {Opponent} from "./interface/Opponent";
import {ThisShouldNeverHappenException} from "../core/exception/ThisShouldNeverHappenException";
import {BaseApp} from "../core/BaseApp";

declare let PlainDraggable: any;

export class App extends BaseApp {
    private $playerBoard =  $('#playerBoard');
    private $opponentBoard = $('#opponentBoard');
    private $opponentOverlay = $('#opponentOverlay');

    private state: State;

    private game: Game;
    private randomOpponent: Opponent;
    private probabilityBasedOpponent: Opponent;


    constructor() {
        super();

        this.game = new GameImpl(Settings.standardSetup());

        const spaceCalculator = new SpaceCalculatorImpl();

        this.randomOpponent = new RandomOpponent(this.randomizer);
        this.probabilityBasedOpponent = new ProbabilityBasedOpponent(this.randomizer, new HeatMapperImpl(spaceCalculator), spaceCalculator);

        this.$overlay.hide();
        this.$opponentOverlay.hide();
        this.drawBoards(this.game.getState());
        this.$resetButton.on('click', () => this.reset());
        this.$overlayReset.on('click', () => this.reset());
        this.$opponentBoard.on('click', (e) => {
            switch (this.state.phase) {
                case Phase.SETUP:
                    this.placeShips();
                    break;
                case Phase.FIRING:
                    this.placeShot(e);
                    break;
            }
        });
    }

    private placeShips(): void {
        const list = [];
        this.$playerBoard.find('.ship')
            .each((i, s) => {
                    list.push(this.parseShipArrangement(s));
                }
            );
        try {
            this.game.placeShips(list, this.randomOpponent);
            this.drawBoards(this.game.getState());
        } catch (e) {
            this.drawBoards(new State(e));
        }
    }

    private parseShipArrangement(ship): ShipArrangement {
        const $ship = $(ship);
        let type;
        if ($ship.hasClass(Carrier.name.toLowerCase())) type = Carrier.name;
        if ($ship.hasClass(Battleship.name.toLowerCase())) type = Battleship.name;
        if ($ship.hasClass(Destroyer.name.toLowerCase())) type = Destroyer.name;
        if ($ship.hasClass(Patrol.name.toLowerCase())) type = Patrol.name;
        const o = $ship.hasClass('horizontal') ? Orientation.HORIZONTAL : Orientation.VERTICAL;

        const x = Math.round(($ship.offset().left - this.$playerBoard.offset().left)/40);
        const y = Math.round(($ship.offset().top - this.$playerBoard.offset().top)/40);

        return new ShipArrangement(Helper.shipConstructors[type](), new Coord(x, y, o));
    }

    private reset(): void {
        this.game.reset();
        this.drawBoards(this.game.getState());
    }

    private placeShot(e): void {
        if ($(e.target).hasClass('hit')) return;
        const x = Math.round((e.offsetX-20)/40);
        const y = Math.round((e.offsetY-20)/40);
        try {
            this.game.shoot(x, y, this.probabilityBasedOpponent);
            this.drawBoards(this.game.getState());
        } catch (e) {
            this.drawBoards(new State(e));
        }
    }

    private drawBoards(state: State): void {
        if (state.error) {
            this.overlay('ERROR: '+state.error);
        } else {
            this.state = state;
            this.$playerBoard.find('.ship, .hit').remove();
            this.$opponentBoard.find('.ship, .hit').remove();
        }

        this.opponentBoardOverlay();

        switch (state.phase) {
            case Phase.SETUP:
                this.placeShipSetup(state.setup);
                this.opponentBoardOverlay();
                break;
            case Phase.FINISHED:
                this.overlay('WINNER: ' + Turn[(state.opponentBeaten ? Turn.PLAYER : Turn.OPPONENT)]);
            case Phase.FIRING:
                this.appendShips(this.$playerBoard, state.playerBoard.getShips());
                this.appendShips(this.$opponentBoard, state.opponentBoard.getShips());

                this.appendHits(this.$playerBoard, state.playerBoard.getHitMap());
                this.appendHits(this.$opponentBoard, state.opponentBoard.getHitMap());
                break;
            default:
                throw new ThisShouldNeverHappenException();
        }
    }

    private opponentBoardOverlay(): void {
        let text;
        if (this.state.phase == Phase.SETUP) {
            text = 'SET SHIPS';
        }
        if (this.state.phase == Phase.FIRING && this.state.turn == Turn.OPPONENT) {
            text = 'OPPONENT\'S TURN';
        }
        if (text) {
            this.$opponentOverlay.find('div').text(text);
            this.$opponentOverlay.show();
        } else {
            this.$opponentOverlay.hide();
        }
    }

    private placeShipSetup(setup:Setup): void {
        setup.getShips().forEach((s, i) => {
            const ship = $('<div/>');
            ship.append('<div><i class="fas fa-sync-alt"></i></div>');
            ship.addClass('ship');
            ship.addClass('horizontal');
            ship.addClass(s.constructor.name.toLowerCase());
            ship.css('top', (i*10)+'%');
            this.$playerBoard.append(ship);
            this.makeDraggable(ship[0]);
        });
        $('.ship > div > i').on('click touchstart', (e) => {
            const $ship = $(e.target).closest('.ship');
            $ship.toggleClass('horizontal').toggleClass('vertical');
            this.makeDraggable($ship[0]);
        });
    }

    private appendShips($board:JQuery, ships:ShipArrangement[]): void {
        ships.forEach(s => $board.append(this.createShip(s.ship, s.coord)));
    }

    private createShip(ship:IShip, coord:Coord): JQuery {
        const s = $('<div/>');
        s.addClass('ship');
        s.addClass(ship.constructor.name.toLowerCase());
        s.addClass(Orientation[coord.o].toLowerCase());
        s.addClass('x'+coord.x);
        s.addClass('y'+coord.y);
        s.append($('<div/>'));
        return s;
    }

    private appendHits($board:JQuery, hits: HitMap): void {
        for (let i = 0;  i < hits.coordX.length; i++) {
            $board.append(this.createHit(hits.coordX[i], hits.coordY[i], hits.hit[i]));
        }
    }

    private createHit(x:number, y:number, hit: boolean): JQuery {
        const h = $('<div/>');
        h.addClass('hit');
        h.addClass('x'+x);
        h.addClass('y'+y);
        h.addClass(hit ? 'success' : 'fail');
        return h;
    }

    private makeDraggable(element:HTMLElement): void {
        new PlainDraggable(element, {
                containment: document.getElementById('playerBoard'),
                snap: {
                    x: {step: 40},
                    y: {step: 40},
                    gravity: 401
                }
            }
        );
    }
}