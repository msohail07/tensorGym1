export function primaryBodyPoint(leftKeyPoint, rightKeyPoint) {
    return leftKeyPoint.score > rightKeyPoint.score ? leftKeyPoint : rightKeyPoint
}