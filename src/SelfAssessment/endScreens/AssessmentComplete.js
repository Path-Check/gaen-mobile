import React, { useContext } from "react"
import { StyleSheet } from "react-native"
import { useTranslation } from "react-i18next"

import { Icons, Images } from "../../assets"
import { AssessmentNavigationContext } from "../Context"
import { AssessmentLayout } from "../AssessmentLayout"
import InfoText from "../InfoText"
import { Button } from "../../components/Button"

import { Colors } from "../../styles"

/** @type {React.FunctionComponent<{}>} */
export const AssessmentComplete = () => {
  const { t } = useTranslation()
  const { dismiss } = useContext(AssessmentNavigationContext)

  return (
    <AssessmentLayout
      backgroundColor={Colors.primaryBackground}
      backgroundImage={Images.EmptyPathBackground}
      icon={Icons.SelfAssessment}
      footer={
        <Button
          onPress={dismiss}
          label={t("assessment.complete_cta")}
          customButtonStyle={style.button}
          customTextStyle={style.buttonText}
          testID="assessment-button"
        />
      }
    >
      <InfoText
        title={t("assessment.complete_title")}
        description={t("assessment.complete_description")}
      />
    </AssessmentLayout>
  )
}

const style = StyleSheet.create({
  button: {
    backgroundColor: Colors.secondaryViolet,
  },
  buttonText: {
    color: Colors.white,
  },
})
