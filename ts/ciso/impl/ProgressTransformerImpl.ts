import {ProgressTransformer} from "../interface/ProgressTransformer";

export class ProgressTransformerImpl implements ProgressTransformer {
    transform(x: number): number {
        return (-Math.cos(x*Math.PI)+1)/2;
    }
}