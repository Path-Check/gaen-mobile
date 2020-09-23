import React, { FunctionComponent, useState } from "react"
import { View, TouchableHighlight, StyleSheet, ScrollView } from "react-native"
import { useTranslation } from "react-i18next"
import { useNavigation } from "@react-navigation/native"

import { useStatusBarEffect, MyHealthStackScreens } from "../navigation"
import { GlobalText, Button, StatusBar } from "../components"
import {
  symptoms,
  HealthAssessment,
  determineHealthAssessment,
} from "./symptoms"
import { showMessage } from "react-native-flash-message"

import { Affordances, Colors, Spacing, Typography, Outlines } from "../styles"
import { useSymptomLogContext } from "./SymptomLogContext"

const SelectSymptomsScreen: FunctionComponent = () => {
  useStatusBarEffect("dark-content", Colors.primaryLightBackground)
  const { t } = useTranslation()
  const navigation = useNavigation()
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([])
  const { addLogEntry } = useSymptomLogContext()

  const handleOnPressSymptom = (selectedSymptom: string) => {
    const indexOfSelectedSymptom = selectedSymptoms.indexOf(selectedSymptom)
    if (indexOfSelectedSymptom >= 0) {
      const newSelectedSymptoms = [...selectedSymptoms]
      newSelectedSymptoms.splice(indexOfSelectedSymptom, 1)
      setSelectedSymptoms(newSelectedSymptoms)
    } else {
      setSelectedSymptoms([...selectedSymptoms, selectedSymptom])
    }
  }

  const handleOnPressSave = () => {
    addLogEntry(selectedSymptoms)

    const currentHealthAssessment = determineHealthAssessment(selectedSymptoms)
    if (currentHealthAssessment === HealthAssessment.AtRisk) {
      showMessage({
        message: t("symptom_checker.success_message"),
        ...Affordances.successFlashMessageOptions,
      })
      navigation.navigate(MyHealthStackScreens.AtRiskRecommendation)
    } else {
      navigation.goBack()
    }
  }

  const determineSymptomButtonStyle = (symptom: string) => {
    return selectedSymptoms.includes(symptom)
      ? { ...style.symptomButton, ...style.symptomButtonSelected }
      : style.symptomButton
  }

  const determineSymptomButtonTextStyle = (symptom: string) => {
    return selectedSymptoms.includes(symptom)
      ? { ...style.symptomButtonText, ...style.symptomButtonTextSelected }
      : style.symptomButtonText
  }

  return (
    <>
      <StatusBar backgroundColor={Colors.primaryLightBackground} />
      <ScrollView
        style={style.container}
        contentContainerStyle={style.contentContainer}
        alwaysBounceVertical={false}
      >
        <GlobalText style={style.headerText}>
          {t("symptom_checker.what_symptoms")}
        </GlobalText>
        <View style={style.symptomButtonsContainer}>
          {symptoms.map((value) => {
            const translatedSymptom = t(`symptoms.${value}`)
            return (
              <TouchableHighlight
                key={value}
                onPress={() => handleOnPressSymptom(value)}
                style={determineSymptomButtonStyle(value)}
                underlayColor={Colors.neutral10}
                accessibilityLabel={translatedSymptom}
              >
                <GlobalText style={determineSymptomButtonTextStyle(value)}>
                  {translatedSymptom}
                </GlobalText>
              </TouchableHighlight>
            )
          })}
        </View>
        <Button
          onPress={handleOnPressSave}
          label={t("common.save")}
          disabled={selectedSymptoms.length === 0}
        />
      </ScrollView>
    </>
  )
}

const style = StyleSheet.create({
  container: {
    backgroundColor: Colors.primaryLightBackground,
  },
  contentContainer: {
    flexGrow: 1,
    backgroundColor: Colors.primaryLightBackground,
    paddingTop: Spacing.xxxHuge,
    paddingHorizontal: Spacing.large,
    paddingBottom: Spacing.xxHuge,
  },
  headerText: {
    ...Typography.header2,
    marginBottom: Spacing.large,
  },
  symptomButtonsContainer: {
    flexWrap: "wrap",
    flexDirection: "row",
    marginBottom: Spacing.medium,
  },
  symptomButton: {
    borderWidth: Outlines.hairline,
    borderColor: Colors.neutral25,
    borderRadius: Outlines.borderRadiusMax,
    paddingVertical: Spacing.xxSmall,
    paddingHorizontal: Spacing.medium,
    marginBottom: Spacing.small,
    marginRight: Spacing.small,
  },
  symptomButtonSelected: {
    backgroundColor: Colors.primary100,
    borderColor: Colors.primary100,
  },
  symptomButtonText: {
    ...Typography.body1,
  },
  symptomButtonTextSelected: {
    color: Colors.white,
  },
})

export default SelectSymptomsScreen
