import React, { FunctionComponent } from "react"
import { useTranslation } from "react-i18next"
import { useNavigation } from "@react-navigation/native"
import { StyleSheet } from "react-native"

import { SelfScreenerStackScreens } from "../navigation"
import { useSelfScreenerContext } from "../SelfScreenerContext"
import { Button, Text } from "../components"
import { OtherSymptom, PrimarySymptom, SecondarySymptom } from "./selfScreener"
import SymptomCheckbox from "./SymptomCheckbox"
import SelfScreenerLayout from "./SelfScreenerLayout"

import { Typography, Spacing, Buttons } from "../styles"

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
  } = useSelfScreenerContext()

  const symptomToString = (
    symptom: PrimarySymptom | SecondarySymptom | OtherSymptom,
  ) => {
    switch (symptom) {
      case FEVER_OR_CHILLS:
        return t("self_screener.general_symptoms.fever_or_chills")
      case MODERATE_DIFFICULTY_BREATHING:
        return t("self_screener.general_symptoms.difficulty_breathing")
      case COUGH:
        return t("self_screener.general_symptoms.cough")
      case LOSS_OF_SMELL_TASTE_APPETITE:
        return t("self_screener.general_symptoms.loss_of_smell_taste_appetite")
      case ACHING:
        return t("self_screener.general_symptoms.aching")
      case VOMITING_OR_DIARRHEA:
        return t("self_screener.general_symptoms.vomiting_or_diarrhea")
      case OTHER:
        return t("self_screener.general_symptoms.other")
    }
  }

  const handleOnPressNext = () => {
    navigation.navigate(SelfScreenerStackScreens.UnderlyingConditions)
  }

  const noSymptomsSelected =
    [...primarySymptoms, ...secondarySymptoms, ...otherSymptoms].length === 0
  return (
    <SelfScreenerLayout
      bottomActionsContent={
        <Button
          label={t("common.next")}
          onPress={handleOnPressNext}
          hasRightArrow
          disabled={noSymptomsSelected}
          customButtonStyle={style.button}
          customButtonInnerStyle={style.buttonInner}
        />
      }
    >
      <Text style={style.headerText}>
        {t("self_screener.general_symptoms.are_you_experiencing")}
      </Text>
      <Text style={style.subheaderText}>
        {t("self_screener.general_symptoms.select_any")}
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
    </SelfScreenerLayout>
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
    width: "100%",
  },
  buttonInner: {
    ...Buttons.medium,
    width: "100%",
  },
})

export default GeneralSymptoms
