import React, { FunctionComponent } from "react"
import { TouchableOpacity, View } from "react-native"
import { useNavigation } from "@react-navigation/native"
import { StackNavigationProp } from "@react-navigation/stack"
import { useTranslation } from "react-i18next"

import { useSymptomLogContext } from "./SymptomLogContext"
import { SymptomLogEntry, Symptom, DayLogData, CheckInStatus } from "./symptoms"
import { GlobalText } from "../components"
import { Posix, posixToDayjs } from "../utils/dateTime"
import { MyHealthStackScreens } from "../navigation"
import { MyHealthStackParams } from "../navigation/MyHealthStack"

type SymptomsListProps = {
  symptoms: Symptom[]
  timestamp: Posix
}

const SymptomsList: FunctionComponent<SymptomsListProps> = ({
  symptoms,
  timestamp,
}) => {
  if (symptoms.length === 0) {
    return null
  }
  const dayJsDate = posixToDayjs(timestamp)

  return (
    <>
      {dayJsDate && (
        <GlobalText>{dayJsDate.local().format("HH:mm")}</GlobalText>
      )}
      {symptoms.map((symptom) => {
        return <GlobalText key={symptom}>{symptom}</GlobalText>
      })}
    </>
  )
}

type LogEntryProps = {
  logEntry: SymptomLogEntry
}

const LogEntry: FunctionComponent<LogEntryProps> = ({ logEntry }) => {
  const { t } = useTranslation()
  const navigation = useNavigation<StackNavigationProp<MyHealthStackParams>>()
  const { symptoms, date } = logEntry

  const handleOnPressEdit = () => {
    navigation.navigate(MyHealthStackScreens.SelectSymptoms, {
      logEntry: JSON.stringify(logEntry),
    })
  }

  return (
    <>
      <SymptomsList symptoms={symptoms} timestamp={date} />
      <TouchableOpacity
        onPress={handleOnPressEdit}
        accessibilityLabel={t("common.edit")}
      >
        <GlobalText>{t("common.edit")}</GlobalText>
      </TouchableOpacity>
    </>
  )
}

type CheckInSummaryProps = {
  status: CheckInStatus
}

const CheckInSummary: FunctionComponent<CheckInSummaryProps> = ({ status }) => {
  const { t } = useTranslation()
  const reportedStatusText =
    status === CheckInStatus.FeelingNotWell
      ? t("my_health.symptom_log.feeling_not_well")
      : t("my_health.symptom_log.feeling_well")
  return <GlobalText>{reportedStatusText}</GlobalText>
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
        <GlobalText>{dayJsDate.local().format("YYYY-MM-DD")}</GlobalText>
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
    <View>
      {dailyLogData.map((logData) => {
        return <DaySummary key={logData.date} dayLogData={logData} />
      })}
    </View>
  )
}

export default OverTime
