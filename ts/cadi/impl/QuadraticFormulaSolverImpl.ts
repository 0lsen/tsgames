import {QuadraticFormulaSolver} from "../interface/QuadraticFormulaSolver";

export class QuadraticFormulaSolverImpl implements QuadraticFormulaSolver {
    solve(a: number, b: number, c: number): number | null {
        if (this.isSolutionImaginary(a, b, c)) {
            return null;
        }
        let solution1 = (-b + Math.sqrt(b*b - 4*a*c)) / (2*a);
        let solution2 = (-b - Math.sqrt(b*b - 4*a*c)) / (2*a);
        return Math.min(solution1, solution2) > 0 ? Math.min(solution1, solution2) : Math.max(solution1, solution2);
    }

    private isSolutionImaginary(a: number, b: number, c: number) : boolean {
        return b*b - 4*a*c < 0;
    }
}