import React, { FunctionComponent } from "react"
import { StyleSheet, TouchableOpacity, View } from "react-native"
import { StackNavigationProp } from "@react-navigation/stack"
import { useNavigation } from "@react-navigation/native"
import { useTranslation } from "react-i18next"

import { MyHealthStackParams } from "../navigation/MyHealthStack"
import { MyHealthStackScreens } from "../navigation"
import { Text } from "../components"
import { posixToDayjs } from "../utils/dateTime"
import { Symptom, SymptomLogEntry } from "./symptoms"

import { Affordances, Typography, Colors, Outlines, Spacing } from "../styles"

type SymptomLogListItemProps = {
  logEntry: SymptomLogEntry
}

const SymptomLogListItem: FunctionComponent<SymptomLogListItemProps> = ({
  logEntry,
}) => {
  const { t } = useTranslation()
  const navigation = useNavigation<StackNavigationProp<MyHealthStackParams>>()

  const { date, symptoms } = logEntry

  const dayJsDate = posixToDayjs(date)

  if (!dayJsDate) {
    return null
  }

  const handleOnPressEdit = () => {
    navigation.navigate(MyHealthStackScreens.SelectSymptoms, {
      logEntry: JSON.stringify(logEntry),
    })
  }

  const dateText = dayJsDate.local().format("MMMM D, YYYY")
  const timeText = dayJsDate.local().format("h:mm A")

  const toSymptomText = (symptom: Symptom) => {
    const translatedSymptom = t(`symptoms.${symptom}`)
    return (
      <View style={style.symptomTextContainer} key={translatedSymptom}>
        <Text style={style.symptomText}>{translatedSymptom}</Text>
      </View>
    )
  }

  return (
    <TouchableOpacity
      onPress={handleOnPressEdit}
      accessibilityLabel={t("common.edit")}
    >
      <View style={style.symptomLogContainer}>
        <View style={style.timeContainer}>
          <Text style={style.datetimeText}>{dateText}</Text>
          <Text style={style.datetimeText}>{timeText}</Text>
        </View>
        <View style={style.symptomsContainer}>
          {symptoms.map(toSymptomText)}
        </View>
      </View>
    </TouchableOpacity>
  )
}

const style = StyleSheet.create({
  symptomLogContainer: {
    ...Affordances.floatingContainer,
    paddingTop: 0,
    paddingBottom: Spacing.small,
    paddingHorizontal: 0,
    marginBottom: Spacing.xLarge,
  },
  timeContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    paddingTop: Spacing.xSmall + 1,
    paddingBottom: Spacing.xSmall,
    paddingHorizontal: Spacing.medium,
    marginBottom: Spacing.small,
    backgroundColor: Colors.neutral5,
    borderTopLeftRadius: Outlines.borderRadiusLarge,
    borderTopRightRadius: Outlines.borderRadiusLarge,
  },
  datetimeText: {
    ...Typography.monospace,
    color: Colors.black,
  },
  symptomsContainer: {
    flexDirection: "column",
    paddingHorizontal: Spacing.medium,
  },
  symptomTextContainer: {
    marginBottom: Spacing.xxxSmall,
  },
  symptomText: {
    ...Typography.body2,
  },
})

export default SymptomLogListItem
