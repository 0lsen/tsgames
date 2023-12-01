import {RandomizerMock} from "../core/RandomizerMock";
import {SmartOpponent} from "../../ts/ttt/opponent/SmartOpponent";
import {GameState} from "../../ts/ttt/GameState";
import {booleanUndefined} from "../../ts/core/types";

const chai = require('chai');
const mocha = require('mocha');

mocha.describe('TTT Opponent', () => {

    let state : GameState;

    mocha.it('prevents player win through binary choice', () => {
        /*
        [X] [ ] [O]
        [O] [X] [X]
        [ ] [X] [O]
        last option
         */
        state = makeMove(
            [true, undefined, false],
            [false, true, true],
            [undefined, true, false]
        );
        chai.expect(state.state[1]).to.be.false;

        /*
        [X] [X] [O]
        [O] [X] [X]
        [ ] [ ] [O]
        first option
         */
        state = makeMove(
            [true, true, false],
            [false, true, true],
            [undefined, undefined, false]
        );
        chai.expect(state.state[7]).to.be.false;

        /*
        [ ] [ ] [O]
        [ ] [X] [X]
        [ ] [ ] [ ]
        multiple choice
         */
        state = makeMove(
            [undefined, undefined, false],
            [undefined, true, true],
            [undefined, undefined, undefined]
        );
        chai.expect(state.state[3]).to.be.false;
    });

    mocha.it('prevents player win through early detection', () => {
        /*
        [ ] [ ] [ ]
        [ ] [X] [ ]
        [ ] [ ] [ ]
        early detection (only corners are safe)
         */
        state = makeMove(
            [undefined, undefined, undefined],
            [undefined, true, undefined],
            [undefined, undefined, undefined],
            2
        );
        chai.expect(state.state[6]).to.be.false;
    });

    mocha.it('makes direct winning move', () => {
        /*
        [X] [ ] [ ]
        [O] [O] [ ]
        [ ] [X] [X]
         */
        state = makeMove(
            [true, undefined, undefined],
            [false, false, undefined],
            [undefined, true, true]
        );
        chai.expect(state.state[5]).to.be.false;
    });

    mocha.it('makes winning move with extra step', () => {
        /*
        [X] [ ] [ ]
        [O] [O] [ ]
        [ ] [X] [X]
        step one
         */
        state = makeMove(
            [true, undefined, undefined],
            [false, false, undefined],
            [undefined, true, true],
            1
        );
        chai.expect(state.state[6]).to.be.false;

        /*
        [X] [ ] [X]
        [O] [O] [ ]
        [O] [X] [X]
        step two
         */
        state = makeMove(
            [true, undefined, true],
            [false, false, undefined],
            [false, true, true]
        );
        chai.expect(state.state[5]).to.be.false;
    });

    mocha.it('makes winning move through early detection', () => {
        /*
        [ ] [ ] [ ]
        [ ] [O] [ ]
        [ ] [X] [ ]
        step one
         */
        state = makeMove(
            [undefined, undefined, undefined],
            [undefined, false, undefined],
            [undefined, true, undefined]
        );
        chai.expect(state.state[0]).to.be.false;

        /*
        [O] [ ] [ ]
        [ ] [O] [ ]
        [ ] [X] [X]
        step two
         */
        state = makeMove(
            [false, undefined, undefined],
            [undefined, false, undefined],
            [undefined, true, true]
        );
        chai.expect(state.state[6]).to.be.false;

        /*
        [O] [ ] [ ]
        [X] [O] [ ]
        [O] [X] [X]
        step three
         */
        state = makeMove(
            [false, undefined, undefined],
            [true, false, undefined],
            [false, true, true]
        );
        chai.expect(state.state[2]).to.be.false;
    });
});

const makeMove = (top : booleanUndefined[], middle : booleanUndefined[], bottom : booleanUndefined[], randomChoice : number = 0) : GameState => {
    let randomizerMock = new RandomizerMock();
    randomizerMock.intReturns = [randomChoice];
    let opponent = new SmartOpponent(randomizerMock);
    let state = new GameState([...top, ...middle, ...bottom], false);
    opponent.makeMove(state);
    return state;
}