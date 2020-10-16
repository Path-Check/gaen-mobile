import React, { FunctionComponent } from "react"
import { StyleSheet, TouchableOpacity, View } from "react-native"
import { StackNavigationProp } from "@react-navigation/stack"
import { useNavigation } from "@react-navigation/native"
import { useTranslation } from "react-i18next"

import { SymptomHistoryStackParams } from "../navigation/SymptomHistoryStack"
import { SymptomHistoryStackScreens } from "../navigation"
import { Text } from "../components"
import { posixToDayjs } from "../utils/dateTime"
import * as Symptom from "./symptom"
import { SymptomEntry } from "./symptomHistory"

import { Affordances, Typography, Colors, Outlines, Spacing } from "../styles"

type SymptomEntryListItemProps = {
  entry: SymptomEntry
}

const SymptomEntryListItem: FunctionComponent<SymptomEntryListItemProps> = ({
  entry,
}) => {
  const { t } = useTranslation()
  const navigation = useNavigation<
    StackNavigationProp<SymptomHistoryStackParams>
  >()

  const dayJsDate = posixToDayjs(entry.date)

  if (!dayJsDate) {
    return null
  }

  const handleOnPressEdit = () => {
    navigation.navigate(SymptomHistoryStackScreens.SelectSymptoms, {
      symptomEntry: entry,
    })
  }

  const dateText = dayJsDate.local().format("MMMM D, YYYY")

  const toSymptomText = (symptom: Symptom.Symptom) => {
    const translatedSymptom = Symptom.toTranslation(t, symptom)
    return (
      <View style={style.symptomTextContainer} key={translatedSymptom}>
        <Text style={style.symptomText}>{translatedSymptom}</Text>
      </View>
    )
  }

  const determineCardContent = (entry: SymptomEntry) => {
    switch (entry.kind) {
      case "NoData": {
        return <Text>{t("symptom_history.no_data")}</Text>
      }
      case "Symptoms": {
        if (entry.symptoms.size > 0) {
          return [...entry.symptoms].map(toSymptomText)
        } else {
          return <Text>{t("symptom_history.no_symptoms")}</Text>
        }
      }
    }
  }

  return (
    <TouchableOpacity
      onPress={handleOnPressEdit}
      accessibilityLabel={`${t("common.edit")} - ${dateText}`}
    >
      <View style={style.symptomLogContainer}>
        <View style={style.timeContainer}>
          <Text style={style.datetimeText}>{dateText}</Text>
        </View>
        <View style={style.symptomsContainer}>
          {determineCardContent(entry)}
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

export default SymptomEntryListItem
