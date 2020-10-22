import React, { FunctionComponent } from "react"
import { useTranslation } from "react-i18next"
import { useNavigation } from "@react-navigation/native"
import { StyleSheet, TouchableOpacity } from "react-native"
import { SvgXml } from "react-native-svg"

import { SelfAssessmentStackScreens } from "../navigation"
import { useSelfAssessmentContext } from "../SelfAssessmentContext"
import { Text } from "../components"
import {
  OtherSymptom,
  PrimarySymptom,
  SecondarySymptom,
} from "./selfAssessment"
import SymptomCheckbox from "./SymptomCheckbox"
import SelfAssessmentLayout from "./SelfAssessmentLayout"

import { Colors, Typography, Spacing, Buttons } from "../styles"
import { Icons } from "../assets"

const GeneralSymptoms: FunctionComponent = () => {
  const { t } = useTranslation()
  const navigation = useNavigation()
  const {
    FEVER_OR_CHILLS,
    COUGH,
    MODERATE_DIFFICULTY_BREATHING,
  } = PrimarySymptom
  const { ACHING, LOSS_OF_SMELL_TASTE_APPETITE } = SecondarySymptom
  const { VOMITING_OR_DIARRHEA, OTHER } = OtherSymptom
  const {
    primarySymptoms,
    secondarySymptoms,
    otherSymptoms,
    updateSymptoms,
  } = useSelfAssessmentContext()

  const symptomToString = (
    symptom: PrimarySymptom | SecondarySymptom | OtherSymptom,
  ) => {
    switch (symptom) {
      case FEVER_OR_CHILLS:
        return t("self_assessment.general_symptoms.fever_or_chills")
      case MODERATE_DIFFICULTY_BREATHING:
        return t("self_assessment.general_symptoms.difficulty_breathing")
      case COUGH:
        return t("self_assessment.general_symptoms.cough")
      case LOSS_OF_SMELL_TASTE_APPETITE:
        return t(
          "self_assessment.general_symptoms.loss_of_smell_taste_appetite",
        )
      case ACHING:
        return t("self_assessment.general_symptoms.aching")
      case VOMITING_OR_DIARRHEA:
        return t("self_assessment.general_symptoms.vomiting_or_diarrhea")
      case OTHER:
        return t("self_assessment.general_symptoms.other")
    }
  }

  const handleOnPressNext = () => {
    navigation.navigate(SelfAssessmentStackScreens.UnderlyingConditions)
  }

  const noSymptomsSelected =
    [...primarySymptoms, ...secondarySymptoms, ...otherSymptoms].length === 0
  return (
    <SelfAssessmentLayout
      bottomActionsContent={
        <TouchableOpacity
          disabled={noSymptomsSelected}
          style={noSymptomsSelected ? style.buttonDisabled : style.button}
          onPress={handleOnPressNext}
          accessibilityLabel={t("common.next")}
        >
          <Text
            style={
              noSymptomsSelected ? style.buttonDisabledText : style.buttonText
            }
          >
            {t("common.next")}
          </Text>
          <SvgXml
            xml={Icons.Arrow}
            fill={
              noSymptomsSelected
                ? Colors.neutral.black
                : Colors.background.primaryLight
            }
          />
        </TouchableOpacity>
      }
    >
      <Text style={style.headerText}>
        {t("self_assessment.general_symptoms.are_you_experiencing")}
      </Text>
      <Text style={style.subheaderText}>
        {t("self_assessment.general_symptoms.select_any")}
      </Text>
      <SymptomCheckbox
        label={symptomToString(FEVER_OR_CHILLS)}
        onPress={() => updateSymptoms(FEVER_OR_CHILLS)}
        checked={primarySymptoms.includes(FEVER_OR_CHILLS)}
      />
      <SymptomCheckbox
        label={symptomToString(MODERATE_DIFFICULTY_BREATHING)}
        onPress={() => updateSymptoms(MODERATE_DIFFICULTY_BREATHING)}
        checked={primarySymptoms.includes(MODERATE_DIFFICULTY_BREATHING)}
      />
      <SymptomCheckbox
        label={symptomToString(COUGH)}
        onPress={() => updateSymptoms(COUGH)}
        checked={primarySymptoms.includes(COUGH)}
      />
      <SymptomCheckbox
        label={symptomToString(LOSS_OF_SMELL_TASTE_APPETITE)}
        onPress={() => updateSymptoms(LOSS_OF_SMELL_TASTE_APPETITE)}
        checked={secondarySymptoms.includes(LOSS_OF_SMELL_TASTE_APPETITE)}
      />
      <SymptomCheckbox
        label={symptomToString(VOMITING_OR_DIARRHEA)}
        onPress={() => updateSymptoms(VOMITING_OR_DIARRHEA)}
        checked={otherSymptoms.includes(VOMITING_OR_DIARRHEA)}
      />
      <SymptomCheckbox
        label={symptomToString(ACHING)}
        onPress={() => updateSymptoms(ACHING)}
        checked={secondarySymptoms.includes(ACHING)}
      />
      <SymptomCheckbox
        label={symptomToString(OTHER)}
        onPress={() => updateSymptoms(OTHER)}
        checked={otherSymptoms.includes(OTHER)}
      />
    </SelfAssessmentLayout>
  )
}

const style = StyleSheet.create({
  headerText: {
    ...Typography.header1,
    marginBottom: Spacing.medium,
  },
  subheaderText: {
    ...Typography.header4,
    ...Typography.base,
    marginBottom: Spacing.huge,
  },
  button: {
    ...Buttons.primaryThin,
    alignSelf: "center",
    width: "100%",
  },
  buttonDisabled: {
    ...Buttons.primaryThinDisabled,
    alignSelf: "center",
    width: "100%",
  },
  buttonText: {
    ...Typography.buttonPrimary,
    marginRight: Spacing.small,
  },
  buttonDisabledText: {
    ...Typography.buttonPrimaryDisabled,
    marginRight: Spacing.small,
  },
})

export default GeneralSymptoms
