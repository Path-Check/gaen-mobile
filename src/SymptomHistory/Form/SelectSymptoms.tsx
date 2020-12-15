import React, { FunctionComponent, useState } from "react"
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Text,
} from "react-native"
import { useTranslation } from "react-i18next"
import { showMessage } from "react-native-flash-message"

import { useStatusBarEffect } from "../../navigation"
import { posixToDayjs } from "../../utils/dateTime"
import { useSymptomHistoryContext } from "../SymptomHistoryContext"
import * as Symptom from "../symptom"
import {
  hasCovidSymptoms,
  hasEmergencySymptoms,
  SymptomEntry,
} from "../symptomHistory"
import Checkbox from "../../components/Checkbox"

import {
  Affordances,
  Buttons,
  Colors,
  Outlines,
  Spacing,
  Typography,
} from "../../styles"

interface SelectSymptomsFormProps {
  entry: SymptomEntry
  showNoSymptoms?: boolean
  onSubmitEmergencySymptoms: () => void
  onSubmitCovidSympotoms: () => void
  onSubmitNoSymptoms: () => void
}

const SelectSymptomsForm: FunctionComponent<SelectSymptomsFormProps> = ({
  entry,
  showNoSymptoms = false,
  onSubmitEmergencySymptoms,
  onSubmitCovidSympotoms,
  onSubmitNoSymptoms,
}) => {
  useStatusBarEffect("dark-content", Colors.secondary.shade10)
  const { t } = useTranslation()
  const { successFlashMessageOptions } = Affordances.useFlashMessageOptions()

  const { updateEntry } = useSymptomHistoryContext()

  const initialSelectedSymptoms =
    entry.kind === "UserInput" ? entry.symptoms : new Set<Symptom.Symptom>()

  const [selectedSymptoms, setSelectedSymptoms] = useState<
    Set<Symptom.Symptom>
  >(initialSelectedSymptoms)

  const handleOnPressSymptom = (selectedSymptom: Symptom.Symptom) => {
    const nextSymptoms = new Set(selectedSymptoms)
    if (nextSymptoms.has(selectedSymptom)) {
      nextSymptoms.delete(selectedSymptom)
    } else {
      nextSymptoms.add(selectedSymptom)
    }
    setSelectedSymptoms(nextSymptoms)
  }

  const handleOnPressNoSymptoms = () => {
    setSelectedSymptoms(new Set<Symptom.Symptom>())
  }

  const handleOnPressSave = async () => {
    const result = await updateEntry(entry, selectedSymptoms)

    if (result.kind === "success") {
      completeOnPressSave()
    } else {
      showMessage({
        message: t("symptom_history.errors.updating_symptoms"),
        ...successFlashMessageOptions,
      })
    }
  }

  const showSuccessMessage = () => {
    showMessage({
      message: t("common.success"),
      ...successFlashMessageOptions,
    })
  }

  const completeOnPressSave = () => {
    if (hasEmergencySymptoms(selectedSymptoms)) {
      onSubmitEmergencySymptoms()
    } else if (hasCovidSymptoms(selectedSymptoms)) {
      onSubmitCovidSympotoms()
    } else {
      onSubmitNoSymptoms()
      showSuccessMessage()
    }
  }

  const hasNoUserInputSelected = selectedSymptoms.size === 0

  const dayJsDate = posixToDayjs(entry.date)
  const dateText = dayJsDate?.local().format("MMMM D, YYYY")

  return (
    <View style={style.container}>
      <ScrollView
        contentContainerStyle={style.contentContainer}
        alwaysBounceVertical={false}
      >
        <Text style={style.dateText}>{dateText}</Text>
        <View style={style.symptomButtonsContainer}>
          {showNoSymptoms ? (
            <View style={style.noSymptomsCheckbox}>
              <Checkbox
                key={"no_symptoms"}
                label={t("symptom_history.no_symptoms")}
                onPress={handleOnPressNoSymptoms}
                checked={hasNoUserInputSelected}
              />
            </View>
          ) : null}
          {Symptom.all.map((symptom: Symptom.Symptom) => {
            const translation = Symptom.toTranslation(t, symptom)
            return (
              <Checkbox
                key={symptom}
                label={translation}
                onPress={() => handleOnPressSymptom(symptom)}
                checked={selectedSymptoms.has(symptom)}
              />
            )
          })}
        </View>
      </ScrollView>
      <TouchableOpacity
        testID={"select-symptoms-save"}
        onPress={handleOnPressSave}
        style={style.button}
      >
        <Text style={style.buttonText}>{t("common.save")}</Text>
      </TouchableOpacity>
    </View>
  )
}

const style = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background.primaryLight,
  },
  contentContainer: {
    flexGrow: 1,
    backgroundColor: Colors.background.primaryLight,
    paddingTop: Spacing.medium,
    paddingHorizontal: Spacing.large,
  },
  dateText: {
    ...Typography.header.x40,
    marginBottom: Spacing.small,
  },
  symptomButtonsContainer: {
    marginBottom: Spacing.medium,
  },
  noSymptomsCheckbox: {
    paddingBottom: Spacing.xSmall - 2,
    marginBottom: Spacing.xLarge,
    borderBottomWidth: Outlines.hairline,
    borderColor: Colors.neutral.shade50,
  },
  button: {
    ...Buttons.fixedBottom.base,
  },
  buttonText: {
    ...Typography.button.fixedBottom,
  },
})

export default SelectSymptomsForm
