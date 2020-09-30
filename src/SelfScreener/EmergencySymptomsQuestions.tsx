import React, { FunctionComponent } from "react"
import { useTranslation } from "react-i18next"
import { ScrollView } from "react-native"
import { useNavigation } from "@react-navigation/native"

import { SelfScreenerStackScreens } from "../navigation"
import { Button, GlobalText } from "../components"

import { EmergencySymptom, SymptomGroup } from "./selfScreener"
import { useSelfScreenerContext } from "../SelfScreenerContext"
import SymptomCheckbox from "./SymptomCheckbox"

const EmergencySymptomsQuestions: FunctionComponent = () => {
  const { t } = useTranslation()
  const navigation = useNavigation()
  const {
    symptomGroup,
    emergencySymptoms,
    updateSymptoms,
  } = useSelfScreenerContext()
  const {
    CHEST_PAIN,
    SEVERE_DIFFICULTY_BREATHING,
    LIGHTHEADEDNESS,
    DISORIENTATION,
  } = EmergencySymptom

  const handleOnPressNext = () => {
    if (symptomGroup === SymptomGroup.EMERGENCY) {
      return navigation.navigate(SelfScreenerStackScreens.CallEmergencyServices)
    }

    navigation.navigate(SelfScreenerStackScreens.NoEmergencySymptoms)
  }

  const emergencySymptomToString = (symptom: EmergencySymptom): string => {
    switch (symptom) {
      case EmergencySymptom.CHEST_PAIN:
        return t("self_screener.emergency_symptoms.chest_pain")
      case EmergencySymptom.SEVERE_DIFFICULTY_BREATHING:
        return t("self_screener.emergency_symptoms.difficulty_breathing")
      case EmergencySymptom.LIGHTHEADEDNESS:
        return t("self_screener.emergency_symptoms.lightheadedness")
      case EmergencySymptom.DISORIENTATION:
        return t("self_screener.emergency_symptoms.disorientation")
    }
  }

  return (
    <ScrollView>
      <GlobalText>
        {t("self_screener.emergency_symptoms.select_any")}
      </GlobalText>
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
      <Button
        label={t("common.next")}
        onPress={handleOnPressNext}
        hasRightArrow
      />
    </ScrollView>
  )
}

export default EmergencySymptomsQuestions
