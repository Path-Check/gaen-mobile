import React, { FunctionComponent } from "react"
import { ScrollView, StyleSheet, TouchableOpacity, View } from "react-native"
import { useNavigation } from "@react-navigation/native"
import { StackNavigationProp } from "@react-navigation/stack"
import { useTranslation } from "react-i18next"

import { useSymptomLogContext } from "./SymptomLogContext"
import { SymptomLogEntry, DayLogData, CheckInStatus } from "./symptoms"
import { GlobalText } from "../components"
import { posixToDayjs } from "../utils/dateTime"
import { MyHealthStackScreens } from "../navigation"
import { MyHealthStackParams } from "../navigation/MyHealthStack"
import { Typography, Colors, Outlines, Spacing } from "../styles"

type CheckInSummaryProps = {
  status: CheckInStatus
}

const CheckInSummary: FunctionComponent<CheckInSummaryProps> = ({ status }) => {
  const { t } = useTranslation()
  const [statusDotText, statusDotStyle] =
    status === CheckInStatus.FeelingNotWell
      ? [t("my_health.symptom_log.feeling_not_well"), style.statusDotOrange]
      : [t("my_health.symptom_log.feeling_well"), style.statusDotGreen]

  return (
    <View style={style.checkInStatusContainer}>
      <View style={{ ...style.statusDot, ...statusDotStyle }} />
      <GlobalText style={style.checkInStatusText}>{statusDotText}</GlobalText>
    </View>
  )
}

type LogEntryProps = {
  logEntry: SymptomLogEntry
}

const LogEntry: FunctionComponent<LogEntryProps> = ({ logEntry }) => {
  const { t } = useTranslation()
  const navigation = useNavigation<StackNavigationProp<MyHealthStackParams>>()
  const { symptoms, date } = logEntry

  if (symptoms.length === 0) {
    return null
  }

  const dayJsDate = posixToDayjs(date)

  const handleOnPressEdit = () => {
    navigation.navigate(MyHealthStackScreens.SelectSymptoms, {
      logEntry: JSON.stringify(logEntry),
    })
  }

  return (
    <View style={style.symptomLogContainer}>
      <View style={style.timeAndEditContainer}>
        {dayJsDate && (
          <GlobalText style={style.timeText}>
            {dayJsDate.local().format("HH:mm A")}
          </GlobalText>
        )}
        <TouchableOpacity
          onPress={handleOnPressEdit}
          accessibilityLabel={t("common.edit")}
        >
          <GlobalText style={style.editText}>{t("common.edit")}</GlobalText>
        </TouchableOpacity>
      </View>
      <View style={style.symptomsContainer}>
        {symptoms.map((symptom) => {
          const translatedSymptom = t(`symptoms.${symptom}`)
          return (
            <View style={style.symptomTextContainer} key={translatedSymptom}>
              <GlobalText style={style.symptomText}>
                {translatedSymptom}
              </GlobalText>
            </View>
          )
        })}
      </View>
    </View>
  )
}

type DaySummaryProps = {
  dayLogData: DayLogData
}

const DaySummary: FunctionComponent<DaySummaryProps> = ({
  dayLogData: { date, checkIn, logEntries },
}) => {
  const dayJsDate = posixToDayjs(date)

  return (
    <>
      {dayJsDate && (
        <GlobalText style={style.dateText}>
          {dayJsDate.local().format("MMMM D, YYYY")}
        </GlobalText>
      )}
      {checkIn && <CheckInSummary status={checkIn.status} />}
      {logEntries.map((logEntry) => {
        return <LogEntry key={logEntry.id} logEntry={logEntry} />
      })}
    </>
  )
}

const OverTime: FunctionComponent = () => {
  const { dailyLogData } = useSymptomLogContext()

  return (
    <ScrollView
      style={style.container}
      contentContainerStyle={style.contentContainer}
      alwaysBounceVertical={false}
    >
      {dailyLogData.map((logData) => {
        return <DaySummary key={logData.date} dayLogData={logData} />
      })}
    </ScrollView>
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

export default OverTime
