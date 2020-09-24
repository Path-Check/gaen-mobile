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
} from "../styles"
import { SvgXml } from "react-native-svg"
import { Icons } from "../assets"
import { MyHealthStackParams } from "../navigation/MyHealthStack"

const SelectSymptomsScreen: FunctionComponent = () => {
  useStatusBarEffect("dark-content", Colors.primaryLightBackground)
  const { t } = useTranslation()
  const navigation = useNavigation()
  const route = useRoute<RouteProp<MyHealthStackParams, "SelectSymptoms">>()
  const { addLogEntry, updateLogEntry } = useSymptomLogContext()

  const { logEntry } = route.params
  const symptomLogEntryToEdit = logEntry ? JSON.parse(logEntry) : null
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

  const handleOnPressSave = () => {
    if (symptomLogEntryToEdit !== null) {
      updateLogEntry({ ...symptomLogEntryToEdit, symptoms: selectedSymptoms })
    } else {
      addLogEntry(selectedSymptoms)
    }

    const flashMessage = symptomLogEntryToEdit
      ? t("symptom_checker.symptoms_updated")
      : t("symptom_checker.symptoms_saved")

    const currentHealthAssessment = determineHealthAssessment(selectedSymptoms)
    if (currentHealthAssessment === HealthAssessment.AtRisk) {
      showMessage({
        message: flashMessage,
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
        />
      </ScrollView>
    </>
  )
}

const headerHeight = 100

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
  closeIconContainer: {
    position: "absolute",
    right: 0,
    top: 0,
    padding: Spacing.medium,
  },
  headerContainer: {
    width: "100%",
    height: headerHeight,
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    backgroundColor: Colors.white,
  },
  headerText: {
    ...Typography.header2,
    marginBottom: Spacing.large,
    marginLeft: Spacing.small,
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
