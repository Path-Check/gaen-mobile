export type Coordinate = [number, number]

export const toSmoothBezier = (points: Coordinate[]): string => {
  return points.reduce((acc, point, idx, points) => {
    if (idx === 0) {
      return `M ${point[0]},${point[1]}`
    } else {
      const command = sbezierCommand(point, idx, points)
      return `${acc} ${sbezierCommandToString(command)}`
    }
  }, "")
}

export const toLine = (pointA: Coordinate, pointB: Coordinate): string => {
  const [x1, y1] = pointA
  const [x2, y2] = pointB
  return `M ${x1} ${y1} L ${x2} ${y2}`
}

interface SBezierCommand {
  endControlPoint: Coordinate
  endPoint: Coordinate
}

const sbezierCommand = (
  endPoint: Coordinate,
  idx: number,
  points: Coordinate[],
): SBezierCommand => {
  const endControlPoint = controlPoint(
    endPoint,
    points[idx - 1],
    points[idx + 1],
  )
  return {
    endControlPoint,
    endPoint,
  }
}

const sbezierCommandToString = ({
  endControlPoint: [cpeX, cpeY],
  endPoint: [x, y],
}: SBezierCommand): string => {
  return `S ${cpeX},${cpeY} ${x},${y}`
}

const controlPoint = (
  current: Coordinate,
  previous: Coordinate | undefined,
  next: Coordinate | undefined,
): Coordinate => {
  const p = previous || current
  const n = next || current

  const smoothing = 0.15

  const { length: opposedLineLength, angle: opposedLineAngle } = line(p, n)
  const cpAngle = opposedLineAngle + Math.PI
  const cpLength = opposedLineLength * smoothing

  const x = current[0] + Math.cos(cpAngle) * cpLength
  const y = current[1] + Math.sin(cpAngle) * cpLength
  return [x, y]
}

interface Line {
  startPoint: Coordinate
  length: number
  angle: number
}

const line = (pointA: Coordinate, pointB: Coordinate): Line => {
  const lengthX = pointB[0] - pointA[0]
  const lengthY = pointB[1] - pointA[1]
  return {
    startPoint: pointA,
    length: Math.sqrt(Math.pow(lengthX, 2) + Math.pow(lengthY, 2)),
    angle: Math.atan2(lengthY, lengthX),
  }
}
