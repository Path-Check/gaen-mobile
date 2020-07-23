import React from "react"
import { StyleSheet } from "react-native"
import { useTranslation } from "react-i18next"

import { InfoText } from "./InfoText"
import { Button } from "../components/Button"
import { AssessmentLayout } from "./AssessmentLayout"

import { Colors } from "../styles"
import { Icons, Images } from "../assets"

/** @type {React.FunctionComponent<{}>} */
export const AssessmentStart = ({ navigation }) => {
  let { t } = useTranslation()

  const handleButtonPress = () => navigation.push("Agreement")

  return (
    <AssessmentLayout
      backgroundColor={Colors.surveyPrimaryBackground}
      backgroundImage={Images.EmptyPathBackground}
      icon={Icons.SelfAssessment}
      footer={
        <Button
          onPress={handleButtonPress}
          label={t("assessment.start_cta")}
          style={styles.button}
          textStyle={styles.buttonText}
        />
      }
    >
      <InfoText
        title={t("assessment.start_title")}
        description={t("assessment.start_description")}
      />
    </AssessmentLayout>
  )
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: Colors.secondaryViolet,
  },
  buttonText: {
    color: Colors.white,
  },
})
