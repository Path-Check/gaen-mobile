import React, { FunctionComponent } from "react"
import { useTranslation } from "react-i18next"
import { StyleSheet } from "react-native"

import { AssessmentLayout } from "../AssessmentLayout"
import InfoText from "../InfoText"
import { Button } from "../../components"
import { useConfigurationContext } from "../../ConfigurationContext"

import { Icons } from "../../assets"
import { Colors } from "../../styles"
import { useNavigation } from "@react-navigation/native"

export const Share: FunctionComponent = () => {
  const { t } = useTranslation()
  const navigation = useNavigation()
  const { healthAuthorityName } = useConfigurationContext()

  const handleButtonPress = () => navigation.navigate("AssessmentComplete")

  return (
    <AssessmentLayout
      icon={Icons.AnonymizedDataInverted}
      backgroundColor={Colors.primary125}
      footer={
        <Button
          onPress={handleButtonPress}
          label={t("assessment.share_cta")}
          customButtonStyle={style.button}
          customTextStyle={style.buttonText}
          testID="assessment-button"
        />
      }
    >
      <InfoText
        title={t("assessment.share_title")}
        description={t("assessment.share_description", {
          authority: healthAuthorityName,
        })}
      />
    </AssessmentLayout>
  )
}

const style = StyleSheet.create({
  button: {
    backgroundColor: Colors.primary100,
  },
  buttonText: {
    color: Colors.white,
  },
})
