import {CollisionCalculator} from "../interface/CollisionCalculator";
import {Ball} from "../model/Ball";
import {QuadraticFormulaSolver} from "../../core/interface/QuadraticFormulaSolver";
import {CollisionResult} from "../model/CollisionResult";
import {App} from "../App";
import {CanvasTools} from "../../canvas/CanvasTools";

export class CollisionCalculatorImpl implements CollisionCalculator {

    private readonly quadraticFormulaSolver : QuadraticFormulaSolver;

    constructor(quadraticFormulaSolver: QuadraticFormulaSolver) {
        this.quadraticFormulaSolver = quadraticFormulaSolver;
    }

    checkCollision(balls: Ball[], movingBall: Ball) : CollisionResult | null {
        for (let i = 0; i < balls.length; i++) {
            let ball = balls[i];
            if (ball == movingBall) {
                continue;
            }
            let distance = ball.radius + movingBall.radius;
            if (distance > CanvasTools.distance(movingBall, ball)) {
                continue;
            }
            let time = this.timeOfCollision(distance, ball, movingBall);
            if (time != null && time > 0 && time < App.TIMESTEP) {
                return new CollisionResult(
                    ball,
                    time
                );
            }
        }
        return null;
    }

    calculatePostCollisionVelocities(ball1: Ball, ball2: Ball) : void {
        let v1x = ball1.velocity.x
        let v2x = ball2.velocity.x
        let x1 = ball1.x;
        let x2 = ball2.x;
        let v1y = ball1.velocity.y;
        let v2y = ball2.velocity.y;
        let y1 = ball1.y;
        let y2 = ball2.y;
        let m1 = ball1.mass;
        let m2 = ball2.mass;

        ball1.velocity.x = v1x - (2*m2/(m1+m2)) * (((v1x-v2x)*(x1-x2) + (v1y-v2y)*(y1-y2)) / Math.abs(Math.pow(x1-x2, 2)+Math.pow(y1-y2, 2))) * (x1-x2);
        ball1.velocity.y = v1y - (2*m2/(m1+m2)) * (((v1x-v2x)*(x1-x2) + (v1y-v2y)*(y1-y2)) / Math.abs(Math.pow(x1-x2, 2)+Math.pow(y1-y2, 2))) * (y1-y2);
        ball2.velocity.x = v2x - (2*m1/(m1+m2)) * (((v2x-v1x)*(x2-x1) + (v2y-v1y)*(y2-y1)) / Math.abs(Math.pow(x2-x1, 2)+Math.pow(y2-y1, 2))) * (x2-x1);
        ball2.velocity.y = v2y - (2*m1/(m1+m2)) * (((v2x-v1x)*(x2-x1) + (v2y-v1y)*(y2-y1)) / Math.abs(Math.pow(x2-x1, 2)+Math.pow(y2-y1, 2))) * (y2-y1);
    }

    /**
     * solve
     *
     * d = sqrt( (x_2(t) - x_1(t))^2 + (y_2(t) - y_1(t))^2 )
     *
     * with
     *
     * x_1(t) = v_1x*t + x_1
     * x_2(t) = v_2x*t + x_2
     * y_1(t) = g*t^2/2 + v_y1*t + y_1 (g term cancels out)
     * y_2(t) = g*t^2/2 + v_y2*t + y_2 (g term cancels out)
     */
    private timeOfCollision(distance : number, ball1 : Ball, ball2 : Ball) : number | null {
        let v1x = ball1.velocity.x
        let v2x = ball2.velocity.x
        let x1 = ball1.x;
        let x2 = ball2.x;
        let v1y = ball1.velocity.y;
        let v2y = ball2.velocity.y;
        let y1 = ball1.y;
        let y2 = ball2.y;

        // formulate a,b,c for quadratic formula
        let a = v2x*v2x - 2*v1x*v2x + v1x*v1x + v2y*v2y - 2*v1y*v2y + v1y*v1y;
        let b = 2*v2x*x2 - 2*v2x*x1 - 2*v1x*x2 + 2*v1x*x1
            + 2*v2y*y2 - 2*v2y*y1 - 2*v1y*y2 + 2*v1y*y1;
        let c = x2*x2 - 2*x1*x2 + x1*x1
            + y2*y2 - 2*y1*y2 + y1*y1
            - distance*distance;

        return this.quadraticFormulaSolver.solveOne(a, b, c);
    }
}