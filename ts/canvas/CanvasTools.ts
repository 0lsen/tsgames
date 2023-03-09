import {Coord} from "../core/model/Coord";
import {CanvasBall} from "./model/CanvasBall";

export class CanvasTools {

    public static isBallGrab(mouseCoord : Coord, ball : CanvasBall, margin : number = 0) : boolean {
        let dx = mouseCoord.x-ball.x;
        let dy = mouseCoord.y-ball.y;
        return dx*dx+dy*dy < (ball.radius+margin)*(ball.radius+margin);
    }

    public static isBallCollision(ball1 : CanvasBall, ball2 : CanvasBall) : boolean {
        let minDistance = ball1.radius + ball2.radius;
        return this.distance(ball1, ball2) < minDistance;
    }

    public static distance(ball1 : Coord, ball2 : Coord) : number {
        return Math.sqrt(Math.pow(ball1.x-ball2.x, 2) + Math.pow(ball1.y-ball2.y,2));
    }
}