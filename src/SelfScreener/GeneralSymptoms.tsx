import React, { FunctionComponent } from "react"
import { useTranslation } from "react-i18next"
import { ScrollView } from "react-native"
import { useNavigation } from "@react-navigation/native"

import { SelfScreenerStackScreens } from "../navigation"
import { useSelfScreenerContext } from "../SelfScreenerContext"

import { Button, GlobalText } from "../components"
import { GeneralSymptom } from "./selfScreener"

import SymptomCheckbox from "./SymptomCheckbox"

const GeneralSymptoms: FunctionComponent = () => {
  const { t } = useTranslation()
  const navigation = useNavigation()
  const {
    FEVER_OR_CHILLS,
    DIFFICULTY_BREATHING,
    COUGH,
    LOSS_OF_SMELL_TASTE_APPETITE,
    VOMITING_OR_DIARRHEA,
    ACHING,
    OTHER,
  } = GeneralSymptom
  const { generalSymptoms, updateGeneralSymptoms } = useSelfScreenerContext()

  const symptomToString = (symptom: GeneralSymptom) => {
    switch (symptom) {
      case FEVER_OR_CHILLS:
        return t("self_screener.general_symptoms.fever_or_chills")
      case DIFFICULTY_BREATHING:
        return t("self_screener.general_symptoms.difficulty_breathing")
      case COUGH:
        return t("self_screener.general_symptoms.cough")
      case LOSS_OF_SMELL_TASTE_APPETITE:
        return t("self_screener.general_symptoms.loss_of_smell_taste_appetite")
      case VOMITING_OR_DIARRHEA:
        return t("self_screener.general_symptoms.vomiting_or_diarrhea")
      case ACHING:
        return t("self_screener.general_symptoms.aching")
      case OTHER:
        return t("self_screener.general_symptoms.other")
    }
  }

  const handleOnPressNext = () => {
    navigation.navigate(SelfScreenerStackScreens.GeneralSymptomsSummary)
  }

  return (
    <ScrollView>
      <GlobalText>
        {t("self_screener.emergency_symptoms.select_any")}
      </GlobalText>
      <SymptomCheckbox
        label={symptomToString(FEVER_OR_CHILLS)}
        onPress={() => updateGeneralSymptoms(FEVER_OR_CHILLS)}
        checked={generalSymptoms.includes(FEVER_OR_CHILLS)}
      />
      <SymptomCheckbox
        label={symptomToString(DIFFICULTY_BREATHING)}
        onPress={() => updateGeneralSymptoms(DIFFICULTY_BREATHING)}
        checked={generalSymptoms.includes(DIFFICULTY_BREATHING)}
      />
      <SymptomCheckbox
        label={symptomToString(COUGH)}
        onPress={() => updateGeneralSymptoms(COUGH)}
        checked={generalSymptoms.includes(COUGH)}
      />
      <SymptomCheckbox
        label={symptomToString(LOSS_OF_SMELL_TASTE_APPETITE)}
        onPress={() => updateGeneralSymptoms(LOSS_OF_SMELL_TASTE_APPETITE)}
        checked={generalSymptoms.includes(LOSS_OF_SMELL_TASTE_APPETITE)}
      />
      <SymptomCheckbox
        label={symptomToString(VOMITING_OR_DIARRHEA)}
        onPress={() => updateGeneralSymptoms(VOMITING_OR_DIARRHEA)}
        checked={generalSymptoms.includes(VOMITING_OR_DIARRHEA)}
      />
      <SymptomCheckbox
        label={symptomToString(ACHING)}
        onPress={() => updateGeneralSymptoms(ACHING)}
        checked={generalSymptoms.includes(ACHING)}
      />
      <SymptomCheckbox
        label={symptomToString(OTHER)}
        onPress={() => updateGeneralSymptoms(OTHER)}
        checked={generalSymptoms.includes(OTHER)}
      />
      <Button
        label={t("common.next")}
        onPress={handleOnPressNext}
        hasRightArrow
        disabled={generalSymptoms.length === 0}
      />
    </ScrollView>
  )
}

export default GeneralSymptoms
