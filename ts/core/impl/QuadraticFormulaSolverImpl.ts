import {QuadraticFormulaSolver} from "../interface/QuadraticFormulaSolver";

export class QuadraticFormulaSolverImpl implements QuadraticFormulaSolver {
    solveOne(a: number, b: number, c: number): number | undefined {
        if (this.isSolutionImaginary(a, b, c)) {
            return undefined;
        }
        let solution1 = this.solution(a, b, c,false);
        let solution2 = this.solution(a, b, c,true);
        return Math.min(solution1, solution2) > 0 ? Math.min(solution1, solution2) : Math.max(solution1, solution2);
    }

    solveAll(a: number, b: number, c: number): number[] | undefined {
        if (this.isSolutionImaginary(a, b, c)) {
            return undefined;
        }
        return [this.solution(a, b, c, false), this.solution(a, b, c, true)];
    }

    private isSolutionImaginary(a: number, b: number, c: number) : boolean {
        return b*b - 4*a*c < 0;
    }

    private solution(a : number, b : number, c : number, neg : boolean) : number {
        return (-b + (neg ? -1 : 1) * Math.sqrt(b*b - 4*a*c)) / (2*a);
    }
}