import React, { FunctionComponent, useState } from "react"
import { View, TouchableHighlight, StyleSheet, ScrollView } from "react-native"
import { useTranslation } from "react-i18next"
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native"

import { useStatusBarEffect } from "../navigation"
import { useSymptomHistoryContext } from "./SymptomHistoryContext"
import { Text, Button } from "../components"
import { Symptom, SymptomEntry } from "./symptoms"
import { showMessage } from "react-native-flash-message"
import { isSameDay } from "../utils/dateTime"

import {
  Affordances,
  Colors,
  Spacing,
  Typography,
  Outlines,
  Buttons,
} from "../styles"
import { SymptomHistoryStackParams } from "../navigation/SymptomHistoryStack"

const SelectSymptomsScreen: FunctionComponent = () => {
  useStatusBarEffect("dark-content", Colors.secondary10)
  const { t } = useTranslation()
  const navigation = useNavigation()
  const route = useRoute<
    RouteProp<SymptomHistoryStackParams, "SelectSymptoms">
  >()
  const { updateEntry, symptomHistory } = useSymptomHistoryContext()

  const symptomsWithTranslations: Record<Symptom, string> = {
    chest_pain_or_pressure: t("symptoms.chest_pain_or_pressure"),
    difficulty_breathing: t("symptoms.difficulty_breathing"),
    lightheadedness: t("symptoms.lightheadedness"),
    disorientation_or_unresponsiveness: t(
      "symptoms.disorientation_or_unresponsiveness",
    ),
    fever: t("symptoms.fever"),
    chills: t("symptoms.chills"),
    cough: t("symptoms.cough"),
    loss_of_smell: t("symptoms.loss_of_smell"),
    loss_of_taste: t("symptoms.loss_of_taste"),
    loss_of_appetite: t("symptoms.loss_of_appetite"),
    vomiting: t("symptoms.vomiting"),
    diarrhea: t("symptoms.diarrhea"),
    body_aches: t("symptoms.body_aches"),
    other: t("symptoms.other"),
  }

  const entryDate = route.params?.date
  const entryToEdit = symptomHistory.find((el: SymptomEntry) => {
    return isSameDay(el.date, entryDate)
  })

  const initialSelectedSymptoms =
    entryToEdit?.kind === "Symptoms" ? entryToEdit.symptoms : new Set<Symptom>()

  const [selectedSymptoms, setSelectedSymptoms] = useState<Set<Symptom>>(
    initialSelectedSymptoms,
  )

  const handleOnPressSymptom = (selectedSymptom: Symptom) => {
    const nextSymptoms = new Set(Array.from(selectedSymptoms))
    if (nextSymptoms.has(selectedSymptom)) {
      nextSymptoms.delete(selectedSymptom)
    } else {
      nextSymptoms.add(selectedSymptom)
    }
    setSelectedSymptoms(nextSymptoms)
  }

  const handleOnPressSave = async () => {
    const result = await updateEntry(entryDate, selectedSymptoms)

    if (result.kind === "success") {
      completeOnPressSave()
    } else {
      showMessage({
        message: t("symptom_checker.errors.updating_symptoms"),
        ...Affordances.successFlashMessageOptions,
      })
    }
  }

  const completeOnPressSave = () => {
    navigation.goBack()
    showMessage({
      message: t("symptom_checker.symptoms_saved"),
      ...Affordances.successFlashMessageOptions,
    })
  }

  const determineSymptomButtonStyle = (symptom: Symptom) => {
    return selectedSymptoms.has(symptom)
      ? { ...style.symptomButton, ...style.symptomButtonSelected }
      : style.symptomButton
  }

  const determineSymptomButtonTextStyle = (symptom: Symptom) => {
    return selectedSymptoms.has(symptom)
      ? { ...style.symptomButtonText, ...style.symptomButtonTextSelected }
      : style.symptomButtonText
  }

  const symptomsWithTranslationsList = Object.entries(
    symptomsWithTranslations,
  ) as [Symptom, string][]

  return (
    <ScrollView
      style={style.container}
      contentContainerStyle={style.contentContainer}
      alwaysBounceVertical={false}
    >
      <View style={style.symptomButtonsContainer}>
        {symptomsWithTranslationsList.map(
          ([symptom, translation]: [Symptom, string]) => {
            return (
              <TouchableHighlight
                key={symptom}
                onPress={() => handleOnPressSymptom(symptom)}
                style={determineSymptomButtonStyle(symptom)}
                underlayColor={Colors.neutral10}
                accessibilityLabel={translation}
              >
                <Text style={determineSymptomButtonTextStyle(symptom)}>
                  {translation}
                </Text>
              </TouchableHighlight>
            )
          },
        )}
      </View>
      <Button
        onPress={handleOnPressSave}
        label={t("common.save")}
        customButtonStyle={style.saveButton}
        customButtonInnerStyle={style.saveButtonInner}
      />
    </ScrollView>
  )
}

const style = StyleSheet.create({
  container: {
    backgroundColor: Colors.primaryLightBackground,
  },
  contentContainer: {
    flexGrow: 1,
    backgroundColor: Colors.primaryLightBackground,
    paddingTop: Spacing.medium,
    paddingHorizontal: Spacing.large,
    paddingBottom: Spacing.xxHuge,
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
    paddingTop: Spacing.xxSmall - 2,
    paddingBottom: Spacing.xxSmall,
    paddingHorizontal: Spacing.medium,
    marginBottom: Spacing.xSmall,
    marginRight: Spacing.xxSmall,
  },
  symptomButtonSelected: {
    backgroundColor: Colors.neutral100,
    borderColor: Colors.neutral100,
  },
  symptomButtonText: {
    ...Typography.body1,
  },
  symptomButtonTextSelected: {
    color: Colors.white,
  },
  saveButton: {
    width: "100%",
  },
  saveButtonInner: {
    width: "100%",
    paddingTop: Spacing.xSmall,
    paddingBottom: Spacing.xSmall + 1,
  },
  deleteButtonContainer: {
    ...Buttons.secondary,
    alignSelf: "center",
    marginTop: Spacing.medium,
  },
  deleteButtonText: {
    ...Typography.buttonSecondary,
    fontSize: Typography.small,
    color: Colors.danger100,
  },
})

export default SelectSymptomsScreen
