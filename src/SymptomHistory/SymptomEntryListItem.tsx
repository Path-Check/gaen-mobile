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
    containerBorderColor: string
    headerContent: string
    headerStyle: ViewStyle
    symptoms: Set<Symptom.Symptom> | null
  }

  const determineCardConfig = (entry: SymptomEntry): CardConfig => {
    switch (entry.kind) {
      case "NoUserInput": {
        return {
          containerBorderColor: Colors.neutral100,
          headerContent: "No entries for this day.",
          headerStyle: {
            borderBottomLeftRadius: Outlines.borderRadiusLarge,
            borderBottomRightRadius: Outlines.borderRadiusLarge,
          },
          symptoms: null,
        }
      }
      case "UserInput": {
        if (entry.symptoms.size > 0) {
          return {
            containerBorderColor: Colors.danger100,
            headerContent: "You didn't feel well.",
            headerStyle: {},
            symptoms: entry.symptoms,
          }
        } else {
          return {
            containerBorderColor: Colors.success100,
            headerContent: "You felt well.",
            headerStyle: {
              borderBottomLeftRadius: Outlines.borderRadiusLarge,
              borderBottomRightRadius: Outlines.borderRadiusLarge,
            },
            symptoms: null,
          }
        }
      }
    }
  }

  const {
    containerBorderColor,
    headerStyle,
    headerContent,
    symptoms,
  } = determineCardConfig(entry)

  return (
    <TouchableOpacity
      onPress={handleOnPressEdit}
      accessibilityLabel={`${t("common.edit")} - ${dateText}`}
      style={{
        ...style.symptomEntryContainer,
        borderColor: containerBorderColor,
      }}
    >
      <Text style={style.dateText}>{dateText}</Text>
      <Text style={style.healthStatusText}>{headerContent}</Text>
      {symptoms && (
        <View style={style.symptomsContainer}>
          {[...symptoms].map(toSymptomText)}
        </View>
      )}
    </TouchableOpacity>
  )
}

const style = StyleSheet.create({
  symptomEntryContainer: {
    ...Affordances.floatingContainer,
    marginBottom: Spacing.xLarge,
    borderWidth: Outlines.thin,
  },
  dateText: {
    ...Typography.monospace,
    color: Colors.black,
    marginBottom: Spacing.xSmall,
  },
  healthStatusText: {
    ...Typography.header4,
  },
  symptomsContainer: {
    flexDirection: "column",
    marginTop: Spacing.small,
  },
  symptomTextContainer: {
    marginBottom: Spacing.xxxSmall,
  },
  symptomText: {
    ...Typography.body1,
  },
})

export default SymptomEntryListItem
