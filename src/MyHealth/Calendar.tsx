import React, { FunctionComponent } from "react"
import { Text, TouchableOpacity, View, StyleSheet } from "react-native"
import dayjs from "dayjs"

import { Spacing, Typography } from "../styles"
import { GlobalText } from "../components"
import { DayLogData } from "./symptoms"
import DayIndicator from "./DayIndicator."

interface CalendarProps {
  logDataHistory: DayLogData[]
  onSelectDate: (logData: DayLogData) => void
  selectedDay: DayLogData | null
}

const Calendar: FunctionComponent<CalendarProps> = ({
  logDataHistory,
  onSelectDate,
  selectedDay,
}: CalendarProps) => {
  const lastMonth = dayjs().subtract(1, "month")
  const title = `${lastMonth.format("MMMM")} | ${dayjs().format(
    "MMMM",
  )}`.toUpperCase()

  const week1 = logDataHistory.slice(0, 7)
  const week2 = logDataHistory.slice(7, 14)
  const week3 = logDataHistory.slice(14, 21)
  const week4 = logDataHistory.slice(21, 28)

  interface CalendarRowProps {
    week: DayLogData[]
  }

  const CalendarRow = ({ week }: CalendarRowProps) => {
    return (
      <View style={styles.calendarRow}>
        {week
          .filter((logData: DayLogData | null) => logData.checkIn)
          .map((logData: DayLogData) => {
            const isSelected =
              logData.checkIn.date === selectedDay?.checkIn.date

            return (
              <TouchableOpacity
                key={`calendar-day-${logData.checkIn.date}`}
                testID={`calendar-day-${logData.checkIn.date}`}
                onPress={() => onSelectDate(logData)}
              >
                <DayIndicator isSelected={isSelected} logData={logData} />
              </TouchableOpacity>
            )
          })}
      </View>
    )
  }

  const DayLabels = () => {
    const labels = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
    return (
      <View style={styles.calendarRow}>
        {labels.map((label: string, idx: number) => {
          return (
            <View style={styles.labelStyle} key={`calendar-label-${idx}`}>
              <Text style={styles.labelTextStyle}>{label}</Text>
            </View>
          )
        })}
      </View>
    )
  }

  return (
    <View testID={"myhealth-history-calendar"} style={styles.container}>
      <View style={styles.header}>
        <GlobalText style={styles.monthText}>{title}</GlobalText>
      </View>
      <View style={styles.calendarContainer}>
        <DayLabels />
        <CalendarRow week={week1} />
        <CalendarRow week={week2} />
        <CalendarRow week={week3} />
        <CalendarRow week={week4} />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  monthText: {
    ...Typography.bold,
  },
  calendarContainer: {
    flex: 1,
    paddingVertical: Spacing.small,
  },
  calendarRow: {
    flex: 1,
    paddingVertical: Spacing.xxSmall,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  labelStyle: {
    justifyContent: "center",
    alignItems: "center",
    width: Spacing.xHuge,
  },
  labelTextStyle: {},
})

export default Calendar
