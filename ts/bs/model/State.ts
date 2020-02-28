import {Phase} from "../enum/Phase";
import {Turn} from "../enum/Turn";
import {Setup} from "./Setup";
import {Board} from "../interface/Board";
import {Shot} from "./Shot";

export class State {
    private _error: String;
    private _phase: Phase;
    private _turn: Turn;
    private _setup: Setup;
    private _playerBoard: Board;
    private _opponentBoard: Board;
    private _lastShot: Shot;
    private _playerBeaten: boolean;
    private _opponentBeaten: boolean;

    constructor(e: Error = null) {
        if (e !== null) this.error = e.constructor.name;
    }

    get error(): String {
        return this._error;
    }

    set error(value: String) {
        this._error = value;
    }

    get phase(): Phase {
        return this._phase;
    }

    set phase(value: Phase) {
        this._phase = value;
    }

    get turn(): Turn {
        return this._turn;
    }

    set turn(value: Turn) {
        this._turn = value;
    }

    get setup(): Setup {
        return this._setup;
    }

    set setup(value: Setup) {
        this._setup = value;
    }

    get playerBoard(): Board {
        return this._playerBoard;
    }

    set playerBoard(value: Board) {
        this._playerBoard = value;
    }

    get opponentBoard(): Board {
        return this._opponentBoard;
    }

    set opponentBoard(value: Board) {
        this._opponentBoard = value;
    }

    get lastShot(): Shot {
        return this._lastShot;
    }

    set lastShot(value: Shot) {
        this._lastShot = value;
    }

    get playerBeaten(): boolean {
        return this._playerBeaten;
    }

    set playerBeaten(value: boolean) {
        this._playerBeaten = value;
    }

    get opponentBeaten(): boolean {
        return this._opponentBeaten;
    }

    set opponentBeaten(value: boolean) {
        this._opponentBeaten = value;
    }
}