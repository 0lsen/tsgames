export interface QuadraticFormulaSolver {
    solveOne(a : number, b : number, c : number) : number | undefined;
    solveAll(a : number, b : number, c : number) : number[] | undefined;
}