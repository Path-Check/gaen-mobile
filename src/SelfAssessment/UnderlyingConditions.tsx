import React, { FunctionComponent } from "react"
import { StyleSheet, TouchableOpacity } from "react-native"
import { useNavigation } from "@react-navigation/native"
import { useTranslation } from "react-i18next"
import { SvgXml } from "react-native-svg"

import { SelfAssessmentStackScreens } from "../navigation"
import { useSelfAssessmentContext } from "../SelfAssessmentContext"
import { Text } from "../components"
import { UnderlyingCondition } from "./selfAssessment"
import SymptomCheckbox from "./SymptomCheckbox"
import SelfAssessmentLayout from "./SelfAssessmentLayout"

import { Buttons, Colors, Spacing, Typography } from "../styles"
import { Icons } from "../assets"

const UnderlyingConditions: FunctionComponent = () => {
  const { t } = useTranslation()
  const navigation = useNavigation()
  const {
    LUNG_DISEASE,
    HEART_CONDITION,
    WEAKENED_IMMUNE_SYSTEM,
    OBESITY,
    KIDNEY_DISEASE,
    DIABETES,
    LIVER_DISEASE,
    HIGH_BLOOD_PRESSURE,
    BLOOD_DISORDER,
    CEREBROVASCULAR_DISEASE,
    SMOKING,
    PREGNANCY,
  } = UnderlyingCondition
  const {
    underlyingConditions,
    updateUnderlyingConditions,
  } = useSelfAssessmentContext()

  const underlyingConditionToString = (condition: UnderlyingCondition) => {
    switch (condition) {
      case LUNG_DISEASE:
        return t("self_assessment.underlying_conditions.lung_disease")
      case HEART_CONDITION:
        return t("self_assessment.underlying_conditions.heart_condition")
      case WEAKENED_IMMUNE_SYSTEM:
        return t("self_assessment.underlying_conditions.weakened_immune_system")
      case OBESITY:
        return t("self_assessment.underlying_conditions.obesity")
      case KIDNEY_DISEASE:
        return t("self_assessment.underlying_conditions.kidney_disease")
      case DIABETES:
        return t("self_assessment.underlying_conditions.diabetes")
      case LIVER_DISEASE:
        return t("self_assessment.underlying_conditions.liver_disease")
      case HIGH_BLOOD_PRESSURE:
        return t("self_assessment.underlying_conditions.high_blood_pressure")
      case BLOOD_DISORDER:
        return t("self_assessment.underlying_conditions.blood_disorder")
      case CEREBROVASCULAR_DISEASE:
        return t(
          "self_assessment.underlying_conditions.cerebrovascular_disease",
        )
      case SMOKING:
        return t("self_assessment.underlying_conditions.smoking")
      case PREGNANCY:
        return t("self_assessment.underlying_conditions.pregnancy")
    }
  }

  const handleOnPressNext = () => {
    navigation.navigate(SelfAssessmentStackScreens.AgeRange)
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
        {t("self_assessment.underlying_conditions.do_you_have")}
      </Text>
      <Text style={style.subheaderText}>
        {t("self_assessment.underlying_conditions.select_all_or_none")}
      </Text>
      <SymptomCheckbox
        label={underlyingConditionToString(LUNG_DISEASE)}
        onPress={() => updateUnderlyingConditions(LUNG_DISEASE)}
        checked={underlyingConditions.includes(LUNG_DISEASE)}
      />
      <SymptomCheckbox
        label={underlyingConditionToString(HEART_CONDITION)}
        onPress={() => updateUnderlyingConditions(HEART_CONDITION)}
        checked={underlyingConditions.includes(HEART_CONDITION)}
      />
      <SymptomCheckbox
        label={underlyingConditionToString(WEAKENED_IMMUNE_SYSTEM)}
        onPress={() => updateUnderlyingConditions(WEAKENED_IMMUNE_SYSTEM)}
        checked={underlyingConditions.includes(WEAKENED_IMMUNE_SYSTEM)}
      />
      <SymptomCheckbox
        label={underlyingConditionToString(OBESITY)}
        onPress={() => updateUnderlyingConditions(OBESITY)}
        checked={underlyingConditions.includes(OBESITY)}
      />
      <SymptomCheckbox
        label={underlyingConditionToString(KIDNEY_DISEASE)}
        onPress={() => updateUnderlyingConditions(KIDNEY_DISEASE)}
        checked={underlyingConditions.includes(KIDNEY_DISEASE)}
      />
      <SymptomCheckbox
        label={underlyingConditionToString(DIABETES)}
        onPress={() => updateUnderlyingConditions(DIABETES)}
        checked={underlyingConditions.includes(DIABETES)}
      />
      <SymptomCheckbox
        label={underlyingConditionToString(LIVER_DISEASE)}
        onPress={() => updateUnderlyingConditions(LIVER_DISEASE)}
        checked={underlyingConditions.includes(LIVER_DISEASE)}
      />
      <SymptomCheckbox
        label={underlyingConditionToString(HIGH_BLOOD_PRESSURE)}
        onPress={() => updateUnderlyingConditions(HIGH_BLOOD_PRESSURE)}
        checked={underlyingConditions.includes(HIGH_BLOOD_PRESSURE)}
      />
      <SymptomCheckbox
        label={underlyingConditionToString(BLOOD_DISORDER)}
        onPress={() => updateUnderlyingConditions(BLOOD_DISORDER)}
        checked={underlyingConditions.includes(BLOOD_DISORDER)}
      />
      <SymptomCheckbox
        label={underlyingConditionToString(CEREBROVASCULAR_DISEASE)}
        onPress={() => updateUnderlyingConditions(CEREBROVASCULAR_DISEASE)}
        checked={underlyingConditions.includes(CEREBROVASCULAR_DISEASE)}
      />
      <SymptomCheckbox
        label={underlyingConditionToString(SMOKING)}
        onPress={() => updateUnderlyingConditions(SMOKING)}
        checked={underlyingConditions.includes(SMOKING)}
      />
      <SymptomCheckbox
        label={underlyingConditionToString(PREGNANCY)}
        onPress={() => updateUnderlyingConditions(PREGNANCY)}
        checked={underlyingConditions.includes(PREGNANCY)}
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
  buttonText: {
    ...Typography.buttonPrimary,
    marginRight: Spacing.small,
  },
})

export default UnderlyingConditions
