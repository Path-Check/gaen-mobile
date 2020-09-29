import React, { FunctionComponent, useState } from "react"
import { ScrollView, StyleSheet } from "react-native"

import { useSymptomLogContext } from "./SymptomLogContext"
import { Typography, Colors, Outlines, Spacing } from "../styles"
import Calendar from "./Calendar"
import { toLogDataHistory } from "./logDataHistory"
import DaySummary from "./DaySummary"
import { DayLogData } from "./symptoms"

const History: FunctionComponent = () => {
  const { dailyLogData } = useSymptomLogContext()

  const [selectedDay, setSelectedDay] = useState<DayLogData | null>(null)

  const logDataHistory = toLogDataHistory(dailyLogData, 30)

  const handleOnSelectDate = (logData: DayLogData) => {
    setSelectedDay(logData)
  }

  return (
    <>
      <ScrollView
        style={style.container}
        contentContainerStyle={style.contentContainer}
        alwaysBounceVertical={false}
      >
        <Calendar
          logDataHistory={logDataHistory}
          onSelectDate={handleOnSelectDate}
          selectedDay={selectedDay}
        />
        {selectedDay && (
          <DaySummary key={selectedDay.checkIn.date} dayLogData={selectedDay} />
        )}
      </ScrollView>
    </>
  )
}

const style = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.primaryLightBackground,
  },
  contentContainer: {
    paddingVertical: Spacing.large,
    paddingHorizontal: Spacing.large,
  },
  dateText: {
    ...Typography.header4,
    marginBottom: Spacing.xxxSmall,
  },
  checkInStatusContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: Spacing.small,
  },
  statusDot: {
    width: Spacing.xxSmall,
    height: Spacing.xxSmall,
    borderRadius: Outlines.borderRadiusMax,
  },
  statusDotGray: {
    backgroundColor: Colors.neutral75,
  },
  statusDotOrange: {
    backgroundColor: Colors.warning100,
  },
  statusDotGreen: {
    backgroundColor: Colors.success100,
  },
  checkInStatusText: {
    ...Typography.body1,
    marginLeft: Spacing.xxSmall,
  },
  symptomLogContainer: {
    paddingBottom: Spacing.medium,
    marginBottom: Spacing.medium,
    borderBottomWidth: Outlines.hairline,
    borderBottomColor: Colors.neutral10,
  },
  timeAndEditContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    marginBottom: Spacing.xSmall,
  },
  timeText: {
    ...Typography.body2,
    color: Colors.neutral100,
  },
  editText: {
    ...Typography.body2,
  },
  symptomsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  symptomTextContainer: {
    backgroundColor: Colors.neutral10,
    marginBottom: Spacing.xxSmall,
    marginRight: Spacing.xxSmall,
    borderRadius: Outlines.borderRadiusMax,
    paddingVertical: Spacing.xxxSmall,
    paddingHorizontal: Spacing.xSmall,
  },
  symptomText: {
    ...Typography.body2,
  },
})

export default History
