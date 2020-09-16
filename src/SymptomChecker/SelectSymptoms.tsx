import React, { FunctionComponent, useState } from "react"
import { TouchableOpacity, StyleSheet, ScrollView } from "react-native"
import { useTranslation } from "react-i18next"
import { useNavigation } from "@react-navigation/native"

import { useStatusBarEffect } from "../navigation"
import { GlobalText, Button } from "../components"
import { useSymptomCheckerContext } from "./SymptomCheckerContext"

import { Colors, Spacing } from "../styles"

const SelectSymptomsScreen: FunctionComponent = () => {
  useStatusBarEffect("dark-content", Colors.primaryLightBackground)
  const { t } = useTranslation()
  const navigation = useNavigation()
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([])
  const { updateSymptoms } = useSymptomCheckerContext()

  const symptoms = [
    t("symptoms.chest_pain_or_pressure"),
    t("symptoms.difficulty_breathing"),
    t("symptoms.lightheadedness"),
    t("symptoms.disorientation_or_unresponsiveness"),
    t("symptoms.fever"),
    t("symptoms.chills"),
    t("symptoms.cough"),
    t("symptoms.loss_of_smell"),
    t("symptoms.loss_of_taste"),
    t("symptoms.loss_of_appetite"),
    t("symptoms.vomiting"),
    t("symptoms.diarrhea"),
    t("symptoms.body_aches"),
    t("symptoms.other"),
  ]

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
    updateSymptoms(selectedSymptoms)
    navigation.goBack()
  }

  const determineSymptomButtonStyle = (symptom: string) => {
    return selectedSymptoms.includes(symptom)
      ? style.symptomButtonSelected
      : style.symptomButton
  }

  return (
    <>
      <ScrollView
        style={style.container}
        contentContainerStyle={style.contentContainer}
        alwaysBounceVertical={false}
      >
        {symptoms.map((value) => {
          return (
            <TouchableOpacity
              key={value}
              onPress={() => handleOnPressSymptom(value)}
              style={determineSymptomButtonStyle(value)}
            >
              <GlobalText>{value}</GlobalText>
            </TouchableOpacity>
          )
        })}
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
  },
  symptomButton: {},
  symptomButtonSelected: {
    backgroundColor: Colors.success100,
  },
})

export default SelectSymptomsScreen
