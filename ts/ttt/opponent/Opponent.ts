import {GameState} from "../GameState";

export interface Opponent {
    makeMove(state : GameState) : void
}