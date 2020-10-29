import React, { FunctionComponent } from "react"
import { Svg, Path } from "react-native-svg"

import * as SvgPath from "./SvgPath"
import { Colors } from "../styles"

interface LineChartProps {
  lineData: number[]
  width: number
  height: number
  color: string
}

const NUMBER_OF_HORIZONTAL_LINES = 6

const LineChart: FunctionComponent<LineChartProps> = ({
  lineData,
  width,
  height,
  color,
}) => {
  if (lineData.length < 2) {
    return null
  }

  // Scale Data
  const max = Math.max(...lineData)
  const min = Math.min(...lineData)
  const shrinkPathBy = 2
  const scaleFactor = height / (max - min) / shrinkPathBy
  const toScale = (datum: number) => {
    return (datum - min) * scaleFactor
  }

  // Fit Path
  const offset = height / 3
  const xPadding = 10
  const firstXPosition = xPadding / 2
  const pathWidth = width - xPadding
  const xStepWidth = pathWidth / (lineData.length - 1)
  const toOffset = (datum: number) => {
    return datum + offset
  }
  const toCoordinate = (datum: number, idx: number): SvgPath.Coordinate => {
    const xCoordinate = idx === 0 ? firstXPosition : idx * xStepWidth
    return [xCoordinate, height - datum]
  }

  const viewBox = `0 0 ${width} ${height}`

  const scaledData = lineData.map(toScale)
  const offsetData = scaledData.map(toOffset)
  const coordinates = offsetData.map(toCoordinate)
  const trendLinePath = SvgPath.toSmoothBezier(coordinates)

  return (
    <Svg height={height} width="100%" viewBox={viewBox}>
      <HorizontalLines height={height} width={width} />
      <Path
        d={trendLinePath}
        fill="none"
        stroke={color}
        strokeWidth="3"
        strokeLinecap="round"
      />
    </Svg>
  )
}

interface HorizontalLinesProps {
  height: number
  width: number
}

const HorizontalLines: FunctionComponent<HorizontalLinesProps> = ({
  height,
  width,
}) => {
  const buildHorizontalLineYPositions = (
    currentYPosition: number,
  ): number[] => {
    const verticalSpacing = height / (NUMBER_OF_HORIZONTAL_LINES - 1)
    return currentYPosition > height
      ? []
      : buildHorizontalLineYPositions(
          currentYPosition + verticalSpacing,
        ).concat([currentYPosition])
  }

  interface HorizontalLineProps {
    start: SvgPath.Coordinate
    end: SvgPath.Coordinate
    strokeWidth: number
    color: string
  }

  const HorizontalLine: FunctionComponent<HorizontalLineProps> = ({
    start,
    end,
    strokeWidth,
    color,
  }) => {
    const path = SvgPath.toLine(start, end)

    return (
      <Path d={path} fill="none" stroke={color} strokeWidth={strokeWidth} />
    )
  }

  const lineColor = Colors.neutral.shade75
  const horizontalLinesStartingYPosition = 0
  const [baseLineY, ...lineCoords] = buildHorizontalLineYPositions(
    horizontalLinesStartingYPosition,
  )
  const baseLineStart: SvgPath.Coordinate = [0, baseLineY]
  const baseLineEnd: SvgPath.Coordinate = [width, baseLineY]

  return (
    <>
      {lineCoords.map((yCoord: number) => {
        const startPoint: SvgPath.Coordinate = [0, yCoord]
        const endPoint: SvgPath.Coordinate = [width, yCoord]
        return (
          <HorizontalLine
            start={startPoint}
            end={endPoint}
            color={lineColor}
            strokeWidth={1}
            key={`hline-${yCoord}`}
          />
        )
      })}
      <HorizontalLine
        start={baseLineStart}
        end={baseLineEnd}
        color={lineColor}
        strokeWidth={2}
      />
    </>
  )
}

export default LineChart
