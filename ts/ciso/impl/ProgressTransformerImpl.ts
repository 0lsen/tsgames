import {ProgressTransformer} from "../interface/ProgressTransformer";

export class ProgressTransformerImpl implements ProgressTransformer {
    transform(x: number, transitionPhase : number = 0): number {
        if (x < transitionPhase) {
            return 0;
        }
        if (x > 1-transitionPhase) {
            return 1;
        }
        return (-Math.cos((x/(1-2*transitionPhase)-transitionPhase/(1-2*transitionPhase))*Math.PI)+1)/2;
    }
}