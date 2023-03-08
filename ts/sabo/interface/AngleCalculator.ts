export interface AngleCalculator {
    calcAngle(x0 : number, left : boolean) : number|undefined
    setAngleOfRepose(angle : number) : void
}