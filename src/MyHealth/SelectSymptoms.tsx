import React, { FunctionComponent, useState } from "react"
import {
  View,
  TouchableHighlight,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native"
import { useTranslation } from "react-i18next"
import { useNavigation, useRoute, RouteProp } from "@react-navigation/native"

import { useStatusBarEffect, MyHealthStackScreens } from "../navigation"
import { useSymptomLogContext } from "./SymptomLogContext"
import { GlobalText, Button, StatusBar } from "../components"
import {
  symptoms,
  HealthAssessment,
  determineHealthAssessment,
} from "./symptoms"
import { showMessage } from "react-native-flash-message"

import {
  Affordances,
  Colors,
  Spacing,
  Typography,
  Outlines,
  Iconography,
  Buttons,
} from "../styles"
import { SvgXml } from "react-native-svg"
import { Icons } from "../assets"
import { MyHealthStackParams } from "../navigation/MyHealthStack"

const SelectSymptomsScreen: FunctionComponent = () => {
  useStatusBarEffect("dark-content", Colors.secondary10)
  const { t } = useTranslation()
  const navigation = useNavigation()
  const route = useRoute<RouteProp<MyHealthStackParams, "SelectSymptoms">>()
  const { addLogEntry, updateLogEntry, deleteLogEntry } = useSymptomLogContext()

  const logEntry = route.params?.logEntry
  const symptomLogEntryToEdit = logEntry ? JSON.parse(logEntry) : null
  const isEditingLogEntry = symptomLogEntryToEdit !== null

  const initialSelectedSymptoms = symptomLogEntryToEdit?.symptoms || []
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>(
    initialSelectedSymptoms,
  )

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

  const handleOnPressDelete = async () => {
    if (isEditingLogEntry) {
      const result = await deleteLogEntry(symptomLogEntryToEdit.id)
      if (result.kind === "success") {
        showMessage({
          message: t("symptom_checker.entry_deleted"),
          ...Affordances.successFlashMessageOptions,
        })

        navigation.goBack()
      } else {
        showMessage({
          message: t("symptom_checker.errors.deleting_symptom_log"),
          ...Affordances.errorFlashMessageOptions,
        })
      }
    }
  }

  const handleOnPressSave = async () => {
    if (isEditingLogEntry) {
      await updateSymptomLog()
    } else {
      await createNewSymptomLog()
    }
  }

  const createNewSymptomLog = async () => {
    const result = await addLogEntry(selectedSymptoms)

    if (result.kind === "success") {
      completeOnPressSave()
    } else {
      showMessage({
        message: t("symptom_checker.errors.adding_symptoms"),
        ...Affordances.successFlashMessageOptions,
      })
    }
  }

  const updateSymptomLog = async () => {
    const result = await updateLogEntry({
      ...symptomLogEntryToEdit,
      symptoms: selectedSymptoms,
    })

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
    const currentHealthAssessment = determineHealthAssessment(selectedSymptoms)
    if (currentHealthAssessment === HealthAssessment.AtRisk) {
      navigation.navigate(MyHealthStackScreens.AtRiskRecommendation)
    } else {
      navigation.goBack()
      const flashMessage = isEditingLogEntry
        ? t("symptom_checker.symptoms_updated")
        : t("symptom_checker.symptoms_saved")
      showMessage({
        message: flashMessage,
        ...Affordances.successFlashMessageOptions,
      })
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
      <StatusBar backgroundColor={Colors.secondary10} />
      <View style={style.headerContainer}>
        <GlobalText style={style.headerText}>
          {t("symptom_checker.what_symptoms")}
        </GlobalText>
        <TouchableOpacity
          style={style.closeIconContainer}
          onPress={navigation.goBack}
        >
          <SvgXml
            xml={Icons.XInCircle}
            fill={Colors.neutral30}
            width={Iconography.small}
            height={Iconography.small}
          />
        </TouchableOpacity>
      </View>
      <ScrollView
        style={style.container}
        contentContainerStyle={style.contentContainer}
        alwaysBounceVertical={false}
      >
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
          customButtonStyle={style.saveButton}
          customButtonInnerStyle={style.saveButtonInner}
        />
        {isEditingLogEntry && (
          <TouchableOpacity
            onPress={handleOnPressDelete}
            accessibilityLabel={t("symptom_checker.delete_entry")}
            style={style.deleteButtonContainer}
          >
            <GlobalText style={style.deleteButtonText}>
              {t("symptom_checker.delete_entry")}
            </GlobalText>
          </TouchableOpacity>
        )}
      </ScrollView>
    </>
  )
}

const headerHeight = 90

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
  headerContainer: {
    width: "100%",
    height: headerHeight,
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    backgroundColor: Colors.secondary10,
    paddingHorizontal: Spacing.small,
    paddingBottom: Spacing.small,
  },
  headerText: {
    ...Typography.header3,
    paddingRight: Spacing.xxLarge,
  },
  closeIconContainer: {
    position: "absolute",
    right: 0,
    top: 0,
    padding: Spacing.medium,
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
