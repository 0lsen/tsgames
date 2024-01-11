export interface ProgressTransformer {
    transform(x : number, transitionPhase : number) : number;
}