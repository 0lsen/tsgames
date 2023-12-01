import {Cube} from "./Cube";
import {Coord3d} from "./Coord3d";

export class SuperCube extends Cube {

    private readonly _cubes : Cube[];

    constructor(margin : number) {
        super(2, new Coord3d(0,0, 0));
        this._cubes = [];
        const subCubeEdgeLength = (this.edgeLength-6*margin)/3;
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                for (let k = 0; k < 3; k++) {
                    this._cubes.push(new Cube(
                        subCubeEdgeLength,
                        new Coord3d(
                            this._center.x + (k-1)*(subCubeEdgeLength+2*margin),
                            this._center.y + (j-1)*(subCubeEdgeLength+2*margin),
                            this._center.z + (i-1)*(subCubeEdgeLength+2*margin)
                        )
                    ));
                }
            }
        }
    }

    get cubes(): Cube[] {
        return this._cubes;
    }
}