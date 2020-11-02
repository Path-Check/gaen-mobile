import React, { FunctionComponent } from "react"
import { StyleSheet, TouchableOpacity } from "react-native"
import { useTranslation } from "react-i18next"
import { useNavigation } from "@react-navigation/native"
import { SvgXml } from "react-native-svg"
import { useSafeAreaInsets, EdgeInsets } from "react-native-safe-area-context"

import { SelfAssessmentStackScreens, useStatusBarEffect } from "../navigation"
import { Text } from "../components"

import { EmergencySymptom, SymptomGroup } from "./selfAssessment"
import { useSelfAssessmentContext } from "./Context"
import SymptomCheckbox from "./SymptomCheckbox"
import SelfAssessmentLayout from "./SelfAssessmentLayout"

import { Buttons, Colors, Spacing, Typography } from "../styles"
import { Icons } from "../assets"

const EmergencySymptomsQuestions: FunctionComponent = () => {
  useStatusBarEffect("dark-content", Colors.secondary.shade10)
  const { t } = useTranslation()
  const navigation = useNavigation()
  const {
    symptomGroup,
    emergencySymptoms,
    updateSymptoms,
  } = useSelfAssessmentContext()

  const insets = useSafeAreaInsets()
  const style = createStyle(insets)

  const {
    CHEST_PAIN,
    SEVERE_DIFFICULTY_BREATHING,
    LIGHTHEADEDNESS,
    DISORIENTATION,
  } = EmergencySymptom

  const handleOnPressNext = () => {
    if (symptomGroup === SymptomGroup.EMERGENCY) {
      return navigation.navigate(
        SelfAssessmentStackScreens.CallEmergencyServices,
      )
    }

    navigation.navigate(SelfAssessmentStackScreens.GeneralSymptoms)
  }

  const emergencySymptomToString = (symptom: EmergencySymptom): string => {
    switch (symptom) {
      case EmergencySymptom.CHEST_PAIN:
        return t("self_assessment.emergency_symptoms.chest_pain")
      case EmergencySymptom.SEVERE_DIFFICULTY_BREATHING:
        return t("self_assessment.emergency_symptoms.difficulty_breathing")
      case EmergencySymptom.LIGHTHEADEDNESS:
        return t("self_assessment.emergency_symptoms.lightheadedness")
      case EmergencySymptom.DISORIENTATION:
        return t("self_assessment.emergency_symptoms.disorientation")
    }
  }

  return (
    <SelfAssessmentLayout
      bottomActionsContent={
        <TouchableOpacity style={style.button} onPress={handleOnPressNext}>
          <Text style={style.buttonText}>{t("common.next")}</Text>
          <SvgXml xml={Icons.Arrow} fill={Colors.background.primaryLight} />
        </TouchableOpacity>
      }
    >
      <Text style={style.headerText}>
        {t("self_assessment.emergency_symptoms.are_you_experiencing")}
      </Text>
      <Text style={style.subheaderText}>
        {t("self_assessment.emergency_symptoms.select_any")}
      </Text>
      <SymptomCheckbox
        label={emergencySymptomToString(CHEST_PAIN)}
        onPress={() => updateSymptoms(CHEST_PAIN)}
        checked={emergencySymptoms.includes(CHEST_PAIN)}
      />
      <SymptomCheckbox
        label={emergencySymptomToString(SEVERE_DIFFICULTY_BREATHING)}
        onPress={() => updateSymptoms(SEVERE_DIFFICULTY_BREATHING)}
        checked={emergencySymptoms.includes(SEVERE_DIFFICULTY_BREATHING)}
      />
      <SymptomCheckbox
        label={emergencySymptomToString(LIGHTHEADEDNESS)}
        onPress={() => updateSymptoms(LIGHTHEADEDNESS)}
        checked={emergencySymptoms.includes(LIGHTHEADEDNESS)}
      />
      <SymptomCheckbox
        label={emergencySymptomToString(DISORIENTATION)}
        onPress={() => updateSymptoms(DISORIENTATION)}
        checked={emergencySymptoms.includes(DISORIENTATION)}
      />
    </SelfAssessmentLayout>
  )
}

const createStyle = (insets: EdgeInsets) => {
  /* eslint-disable react-native/no-unused-styles */
  return StyleSheet.create({
    headerText: {
      ...Typography.header.x60,
      marginBottom: Spacing.medium,
    },
    subheaderText: {
      ...Typography.header.x30,
      ...Typography.style.normal,
      marginBottom: Spacing.huge,
    },
    button: {
      ...Buttons.fixedBottomThin.base,
      paddingBottom: insets.bottom + Spacing.small,
    },
    buttonText: {
      ...Typography.button.fixedBottom,
      marginRight: Spacing.small,
    },
  })
}

export default EmergencySymptomsQuestions
