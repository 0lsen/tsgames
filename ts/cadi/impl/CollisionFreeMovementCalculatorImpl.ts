import {CollisionFreeMovementCalculator} from "../interface/CollisionFreeMovementCalculator";
import {MovementResult} from "../model/MovementResult";
import {Direction} from "../../core/enum/Direction";
import {Ball} from "../model/Ball";
import {Coord} from "../../core/model/Coord";
import {MovementCalculator} from "../interface/MovementCalculator";

export class CollisionFreeMovementCalculatorImpl implements CollisionFreeMovementCalculator {

    private readonly movementCalculator : MovementCalculator;

    constructor(movementCalculator: MovementCalculator) {
        this.movementCalculator = movementCalculator;
    }

    calculateMovement(ball : Ball, gravityDirection : Direction, dimensions : Coord, time : number): MovementResult {
        let newXPosition = ball.x;
        let newXVelocity = ball.velocity.x;
        let newYPosition = ball.y;
        let newYVelocity = ball.velocity.y;
        let bounce = false;
        if ([Direction.UP, Direction.DOWN, null].includes(gravityDirection)) {
            let calcResult = this.movementCalculator.calcConstantMovement(
                ball.x,
                ball.velocity.x,
                dimensions.x,
                ball.radius
            );
            newXPosition = calcResult.coord;
            if (calcResult.newVelocity) {
                bounce = true;
                newXVelocity = calcResult.newVelocity;
            }
        } else {
            let calcResult = this.movementCalculator.calcAcceleratedMovement(
                ball.x,
                ball.velocity.x,
                dimensions.x,
                ball.radius,
                gravityDirection == Direction.LEFT ? -1 : 1,
                time
            );
            if (calcResult.bounce) {
                bounce = true;
            }
            newXPosition = calcResult.coord;
            newXVelocity = calcResult.newVelocity;
        }
        if ([Direction.RIGHT, Direction.LEFT, null].includes(gravityDirection)) {
            let calcResult = this.movementCalculator.calcConstantMovement(
                ball.y,
                ball.velocity.y,
                dimensions.y,
                ball.radius
            );
            newYPosition = calcResult.coord;
            if (calcResult.newVelocity) {
                bounce = true;
                newYVelocity = calcResult.newVelocity;
            }
        } else {
            let calcResult = this.movementCalculator.calcAcceleratedMovement(
                ball.y,
                ball.velocity.y,
                dimensions.y,
                ball.radius,
                gravityDirection == Direction.UP ? -1 : 1,
                time
            );
            if (calcResult.bounce) {
                bounce =  true;
            }
            newYPosition = calcResult.coord;
            newYVelocity = calcResult.newVelocity;
        }

        return new MovementResult(new Coord(newXPosition, newYPosition), new Coord(newXVelocity, newYVelocity), bounce);
    }
}