import React, { FunctionComponent } from "react"
import { StyleSheet } from "react-native"
import { useTranslation } from "react-i18next"
import { useNavigation } from "@react-navigation/native"

import InfoText from "./InfoText"
import { Button } from "../components/Button"
import { AssessmentLayout } from "./AssessmentLayout"

import { Colors } from "../styles"
import { Icons, Images } from "../assets"

const AssessmentStart: FunctionComponent = () => {
  const { t } = useTranslation()
  const navigation = useNavigation()

  const handleButtonPress = () => {
    navigation.navigate("Agreement")
  }

  return (
    <AssessmentLayout
      backgroundColor={Colors.primaryBackground}
      backgroundImage={Images.EmptyPathBackground}
      icon={Icons.SelfAssessment}
      footer={
        <Button
          onPress={handleButtonPress}
          label={t("assessment.start_cta")}
          buttonStyle={style.button}
          textStyle={style.buttonText}
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

const style = StyleSheet.create({
  button: {
    backgroundColor: Colors.secondaryViolet,
  },
  buttonText: {
    color: Colors.white,
  },
})

export default AssessmentStart
