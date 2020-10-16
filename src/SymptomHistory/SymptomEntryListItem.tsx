import React, { FunctionComponent, ReactNode } from "react"
import { StyleSheet, TouchableOpacity, View, ViewStyle } from "react-native"
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

  interface CardConfig {
    content: ReactNode
    containerStyle: ViewStyle
  }

  const determineCardConfig = (entry: SymptomEntry): CardConfig => {
    switch (entry.kind) {
      case "NoUserInput": {
        return {
          content: <Text>{t("symptom_history.no_data")}</Text>,
          containerStyle: {
            ...style.symptomEntryContainer,
            backgroundColor: "gray",
          },
        }
      }
      case "UserInput": {
        if (entry.symptoms.size > 0) {
          return {
            content: <View>{[...entry.symptoms].map(toSymptomText)}</View>,
            containerStyle: {
              ...style.symptomEntryContainer,
              backgroundColor: "red",
            },
          }
        } else {
          return {
            content: <Text>{t("symptom_history.no_symptoms")}</Text>,
            containerStyle: {
              ...style.symptomEntryContainer,
              backgroundColor: "green",
            },
          }
        }
      }
    }
  }

  return (
    <TouchableOpacity
      onPress={handleOnPressEdit}
      accessibilityLabel={`${t("common.edit")} - ${dateText}`}
      style={}
    >
      <View style={style.timeContainer}>
        <Text style={style.datetimeText}>{dateText}</Text>
      </View>
      <View style={style.symptomsContainer}>{determineCardContent(entry)}</View>
    </TouchableOpacity>
  )
}

const style = StyleSheet.create({
  symptomEntryContainer: {
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
