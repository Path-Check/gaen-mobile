import React, { FunctionComponent } from "react"
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native"
import { useNavigation } from "@react-navigation/native"
import { StackNavigationProp } from "@react-navigation/stack"
import { useTranslation } from "react-i18next"

import { useSymptomLogContext } from "./SymptomLogContext"
import { SymptomLogEntry, DayLogData } from "./symptoms"
import { GlobalText, Button } from "../components"
import { posixToDayjs } from "../utils/dateTime"
import { MyHealthStackScreens } from "../navigation"
import { MyHealthStackParams } from "../navigation/MyHealthStack"
import { Buttons, Typography, Colors, Outlines, Spacing } from "../styles"
import HowAreYouFeeling from "./HowAreYouFeeling"

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
  dayLogData: { date, symptomLogEntries },
}) => {
  const dayJsDate = posixToDayjs(date)

  return (
    <>
      {dayJsDate && (
        <GlobalText style={style.dateText}>
          {dayJsDate.local().format("MMMM D, YYYY")}
        </GlobalText>
      )}
      {symptomLogEntries.map((logEntry) => {
        return <LogEntry key={logEntry.id} logEntry={logEntry} />
      })}
    </>
  )
}

const OverTime: FunctionComponent = () => {
  const { t } = useTranslation()
  const { dailyLogData } = useSymptomLogContext()
  const navigation = useNavigation<StackNavigationProp<MyHealthStackParams>>()

  const noSymptomHistory = dailyLogData.length === 0

  const handleOnPressLogSymptoms = () => {
    navigation.navigate(MyHealthStackScreens.SelectSymptoms)
  }

  return (
    <>
      <ScrollView
        style={style.container}
        contentContainerStyle={style.contentContainer}
        alwaysBounceVertical={false}
      >
        <HowAreYouFeeling />
        <View style={style.floatingContainer}>
          <Button
            onPress={handleOnPressLogSymptoms}
            label={t("symptom_checker.log_symptoms")}
            customButtonStyle={{ ...style.button, ...style.logSymptomsButton }}
            customButtonInnerStyle={style.buttonInner}
            hasPlusIcon
          />
        </View>
        {noSymptomHistory ? (
          <GlobalText style={style.noSymptomHistoryText}>
            {t("symptom_checker.no_symptom_history")}
          </GlobalText>
        ) : (
          dailyLogData.map((logData) => {
            return <DaySummary key={logData.date} dayLogData={logData} />
          })
        )}
      </ScrollView>
    </>
  )
}

const style = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    paddingVertical: Spacing.large,
    paddingHorizontal: Spacing.large,
  },
  dateText: {
    ...Typography.header4,
    marginBottom: Spacing.xxxSmall,
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
  floatingContainer: {
    ...Outlines.lightShadow,
    backgroundColor: Colors.primaryLightBackground,
    borderRadius: Outlines.borderRadiusLarge,
    paddingVertical: Spacing.medium,
    paddingHorizontal: Spacing.large,
    marginBottom: Spacing.large,
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
  noSymptomHistoryText: {
    alignSelf: "center",
    ...Typography.body1,
  },
  button: {
    width: "100%",
    elevation: 0,
    shadowOpacity: 0,
    marginTop: Spacing.large,
  },
  logSymptomsButton: {
    marginTop: 0,
  },
  buttonInner: {
    ...Buttons.medium,
    width: "100%",
  },
})

export default OverTime
