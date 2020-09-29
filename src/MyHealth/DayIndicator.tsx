import React, { FunctionComponent } from "react"
import { View, Text, ViewStyle, TextStyle, StyleSheet } from "react-native"
import dayjs from "dayjs"

import { DateTimeUtils } from "../utils"
import { Outlines, Colors, Typography, Spacing } from "../styles"
import { CheckInStatus, DayLogData } from "./symptoms"

interface DayIndicatorProps {
  logData: DayLogData
  isSelected: boolean
}

type IndicatorStyle = [ViewStyle, TextStyle]

const DayIndicator: FunctionComponent<DayIndicatorProps> = ({
  logData,
  isSelected,
}: DayIndicatorProps) => {
  const isToday = DateTimeUtils.isToday(logData.date)

  const applyRiskStyle = ([
    circleStyle,
    textStyle,
  ]: IndicatorStyle): IndicatorStyle => {
    switch (logData.checkIn.status) {
      case CheckInStatus.NotCheckedIn: {
        return [{ ...circleStyle }, { ...textStyle, color: Colors.primaryText }]
      }
      case CheckInStatus.FeelingGood: {
        return [
          { ...circleStyle, borderColor: Colors.success100 },
          { ...textStyle, color: Colors.success100 },
        ]
      }
      case CheckInStatus.FeelingNotWell: {
        return [
          { ...circleStyle, borderColor: Colors.warning100 },
          { ...textStyle, color: Colors.warning100 },
        ]
      }
    }
  }

  const applyIsTodayStyle = ([
    circleStyle,
    textStyle,
  ]: IndicatorStyle): IndicatorStyle => {
    if (isToday) {
      return [
        {
          ...circleStyle,
        },
        {
          ...textStyle,
          fontWeight: Typography.boldWeight,
        },
      ]
    } else {
      return [circleStyle, textStyle]
    }
  }

  const applyIsSelectedStyle = ([
    circleStyle,
    textStyle,
  ]: IndicatorStyle): IndicatorStyle => {
    if (isSelected) {
      switch (logData.checkIn.status) {
        case CheckInStatus.NotCheckedIn: {
          return [
            {
              ...circleStyle,
              borderColor: Colors.primaryText,
            },
            { ...textStyle, color: Colors.primaryText },
          ]
        }
        case CheckInStatus.FeelingGood: {
          return [
            {
              ...circleStyle,
              borderColor: Colors.success100,
              backgroundColor: Colors.success100,
            },
            { ...textStyle, color: Colors.primaryText },
          ]
        }
        case CheckInStatus.FeelingNotWell: {
          return [
            {
              ...circleStyle,
              borderColor: Colors.warning100,
              backgroundColor: Colors.warning100,
            },
            { ...textStyle, color: Colors.primaryText },
          ]
        }
      }
    } else {
      return [circleStyle, textStyle]
    }
  }

  const baseStyles: IndicatorStyle = [styles.circleBase, styles.textBase]

  const [circleStyle, textStyle] = [baseStyles]
    .map(applyIsTodayStyle)
    .map(applyRiskStyle)
    .map(applyIsSelectedStyle)

  const dayNumber = dayjs(logData.date).format("D")

  const indicator = <Text style={textStyle}>{dayNumber}</Text>

  return <View style={circleStyle}>{indicator}</View>
}

const styles = StyleSheet.create({
  circleBase: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    width: Spacing.xHuge,
    height: Spacing.xHuge,
    borderRadius: Outlines.borderRadiusMax,
    borderColor: Colors.transparent,
    borderWidth: Outlines.hairline,
  },
  textBase: {
    ...Typography.smallFont,
    ...Typography.monospace,
    color: Colors.primaryText,
  },
})

export default DayIndicator
