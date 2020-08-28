import React from "react"
import { TouchableOpacity, View, StyleSheet } from "react-native"
import { useTranslation } from "react-i18next"

import {
  QUESTION_KEY_AGREE,
  SCREEN_TYPE_RADIO,
  SCREEN_TYPE_EMERGENCY,
} from "./constants"
import { AssessmentLayout } from "./AssessmentLayout"
import InfoText from "./InfoText"
import { GlobalText } from "../components/GlobalText"

import { Typography, Buttons, Colors } from "../styles"

/** @type {React.FunctionComponent<{}>} */
export const EmergencyAssessment = ({ navigation }) => {
  const { t } = useTranslation()

  const handleAgreePress = () => {
    navigation.push(SCREEN_TYPE_EMERGENCY)
  }

  const handleDisagreePress = () => {
    navigation.push("AssessmentQuestion", {
      question: agreeQuestion,
      option: agreeOption,
    })
  }

  return (
    <AssessmentLayout
      backgroundColor={Colors.primaryLightBackground}
      footer={
        <ChoiceButtons
          agreePress={handleAgreePress}
          disagreePress={handleDisagreePress}
        />
      }
    >
      <InfoText
        useTitleStyle="headline2"
        title={t("assessment.agree_question_text")}
        description={t("assessment.agree_question_description")}
      />
    </AssessmentLayout>
  )
}

const ChoiceButtons = ({ agreePress, disagreePress }) => {
  const { t } = useTranslation()

  const experiencingSymptomsText =
    t("assessment.i_am") + " " + t("assessment.experiencing_some_symptoms")
  const notExperiencingSymptomsText =
    t("assessment.i_am_not") + " " + t("assessment.experiencing_any_symptoms")

  return (
    <View>
      <TouchableOpacity
        onPress={agreePress}
        accessible
        accessibilityLabel={experiencingSymptomsText}
        accessibilityRole="button"
        style={style.button}
      >
        <GlobalText style={[style.buttonText, style.boldText]}>
          {t("assessment.i_am")}
          <GlobalText style={[style.buttonText, style.regularText]}>
            {t("assessment.experiencing_some_symptoms")}
          </GlobalText>
        </GlobalText>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={disagreePress}
        accessible
        accessibilityLabel={notExperiencingSymptomsText}
        accessibilityRole="button"
        style={[style.button, style.disagreeButton]}
      >
        <GlobalText style={[style.buttonText, style.boldText]}>
          {t("assessment.i_am_not")}
          <GlobalText style={[style.buttonText, style.regularText]}>
            {t("assessment.experiencing_any_symptoms")}
          </GlobalText>
        </GlobalText>
      </TouchableOpacity>
    </View>
  )
}

/** @type {SurveyQuestion} */
const agreeQuestion = {
  option_key: QUESTION_KEY_AGREE,
  question_key: QUESTION_KEY_AGREE,
  question_text: "How old are you?",
  question_type: "TEXT",
  required: false,
  screen_type: SCREEN_TYPE_RADIO,
}

/** @type {SurveyOption} */
const agreeOption = {
  key: QUESTION_KEY_AGREE,
  values: [
    {
      label: "< 18",
      value: "0",
    },
    {
      label: "19-29",
      value: "1",
    },
    {
      label: "30-39",
      value: "2",
    },
    {
      label: "40-49",
      value: "3",
    },
    {
      label: "50-59",
      value: "4",
    },
    {
      label: "60-69",
      value: "5",
    },
    {
      label: "70-79",
      value: "6",
    },
    {
      label: "80+",
      value: "7",
    },
    {
      label: "Choose not to answer",
      value: "8",
    },
  ],
}

const style = StyleSheet.create({
  button: {
    ...Buttons.primary,
    borderWidth: 1,
    borderColor: Colors.steelGray,
  },
  buttonText: {
    ...Typography.buttonPrimaryText,
    textAlign: "center",
    color: Colors.steelGray,
  },
  boldText: {
    ...Typography.bold,
    color: Colors.steelGray,
  },
  regularText: {
    ...Typography.base,
  },
  disagreeButton: {
    marginTop: 10,
  },
})
