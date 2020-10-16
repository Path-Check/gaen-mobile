import React, { FunctionComponent, useState } from "react"
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Text,
} from "react-native"
import { useTranslation } from "react-i18next"
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native"

import { useStatusBarEffect } from "../navigation"
import { useSymptomHistoryContext } from "./SymptomHistoryContext"
import * as Symptom from "./symptom"
import { SymptomEntry } from "./symptomHistory"
import { showMessage } from "react-native-flash-message"
import { posixToDayjs } from "../utils/dateTime"
import Checkbox from "./Checkbox"

import { Affordances, Colors, Outlines, Spacing, Typography } from "../styles"
import { SymptomHistoryStackParams } from "../navigation/SymptomHistoryStack"

const SelectSymptomsScreen: FunctionComponent = () => {
  const route = useRoute<
    RouteProp<SymptomHistoryStackParams, "SelectSymptoms">
  >()

  const entry = route.params?.symptomEntry || {
    kind: "NoData",
    date: Date.now(),
  }

  return <SelectSymptomsForm entry={entry} />
}

interface SelectSymptomsFormProps {
  entry: SymptomEntry
}

export const SelectSymptomsForm: FunctionComponent<SelectSymptomsFormProps> = ({
  entry,
}) => {
  useStatusBarEffect("dark-content", Colors.secondary10)
  const { t } = useTranslation()
  const navigation = useNavigation()

  const { updateEntry } = useSymptomHistoryContext()

  const initialSelectedSymptoms =
    entry.kind === "Symptoms" ? entry.symptoms : new Set<Symptom.Symptom>()

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
        ...Affordances.successFlashMessageOptions,
      })
    }
  }

  const completeOnPressSave = () => {
    navigation.goBack()
    showMessage({
      message: t("common.success"),
      ...Affordances.successFlashMessageOptions,
    })
  }

  const hasNoSymptomsSelected = selectedSymptoms.size === 0

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
          <View style={style.noSymptomsCheckbox}>
            <Checkbox
              key={"no_symptoms"}
              label={t("symptom_history.no_symptoms")}
              onPress={handleOnPressNoSymptoms}
              checked={hasNoSymptomsSelected}
            />
          </View>
          {Symptom.all.map((symptom: Symptom.Symptom) => {
            const translation = t(Symptom.toTranslationKey(symptom))
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
    backgroundColor: Colors.primaryLightBackground,
  },
  contentContainer: {
    flexGrow: 1,
    backgroundColor: Colors.primaryLightBackground,
    paddingTop: Spacing.medium,
    paddingHorizontal: Spacing.large,
  },
  dateText: {
    ...Typography.header3,
    marginBottom: Spacing.small,
  },
  symptomButtonsContainer: {
    marginBottom: Spacing.medium,
  },
  noSymptomsCheckbox: {
    paddingBottom: Spacing.xSmall - 2,
    marginBottom: Spacing.xLarge,
    borderBottomWidth: Outlines.hairline,
    borderColor: Colors.neutral50,
  },
  button: {
    alignItems: "center",
    paddingTop: Spacing.medium,
    paddingBottom: Spacing.medium,
    backgroundColor: Colors.primary100,
  },
  buttonText: {
    ...Typography.buttonPrimary,
    fontSize: Typography.large,
  },
})

export default SelectSymptomsScreen
