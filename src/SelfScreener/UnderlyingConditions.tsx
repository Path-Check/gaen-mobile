import { useNavigation } from "@react-navigation/native"
import { ScrollView } from "react-native"
import React, { FunctionComponent } from "react"
import { useTranslation } from "react-i18next"
import { SelfScreenerStackScreens } from "../navigation"
import { useSelfScreenerContext } from "../SelfScreenerContext"
import { Button, GlobalText } from "../components"
import { UnderlyingCondition } from "./selfScreener"
import SymptomCheckbox from "./SymptomCheckbox"

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
  } = useSelfScreenerContext()

  const underlyingConditionToString = (condition: UnderlyingCondition) => {
    switch (condition) {
      case LUNG_DISEASE:
        return t("self_screener.underlying_conditions.lung_disease")
      case HEART_CONDITION:
        return t("self_screener.underlying_conditions.heart_condition")
      case WEAKENED_IMMUNE_SYSTEM:
        return t("self_screener.underlying_conditions.weakened_immune_system")
      case OBESITY:
        return t("self_screener.underlying_conditions.obesity")
      case KIDNEY_DISEASE:
        return t("self_screener.underlying_conditions.kidney_disease")
      case DIABETES:
        return t("self_screener.underlying_conditions.diabetes")
      case LIVER_DISEASE:
        return t("self_screener.underlying_conditions.liver_disease")
      case HIGH_BLOOD_PRESSURE:
        return t("self_screener.underlying_conditions.high_blood_pressure")
      case BLOOD_DISORDER:
        return t("self_screener.underlying_conditions.blood_disorder")
      case CEREBROVASCULAR_DISEASE:
        return t("self_screener.underlying_conditions.cerebrovascular_disease")
      case SMOKING:
        return t("self_screener.underlying_conditions.smoking")
      case PREGNANCY:
        return t("self_screener.underlying_conditions.pregnancy")
    }
  }

  const handleOnPressNext = () => {
    navigation.navigate(SelfScreenerStackScreens.AgeRange)
  }

  return (
    <ScrollView>
      <GlobalText>
        {t("self_screener.underlying_conditions.select_all_or_none")}
      </GlobalText>
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
      <Button
        label={t("common.next")}
        onPress={handleOnPressNext}
        hasRightArrow
      />
    </ScrollView>
  )
}

export default UnderlyingConditions
