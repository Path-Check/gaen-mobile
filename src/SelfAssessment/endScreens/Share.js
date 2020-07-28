import React from "react"
import { useTranslation } from "react-i18next"
import env from "react-native-config"
import { StyleSheet } from "react-native"

import { AssessmentLayout } from "../AssessmentLayout"
import InfoText from "../InfoText"
import { Button } from "../../components/Button"

import { Icons } from "../../assets"
import { Colors } from "../../styles"

const { GAEN_AUTHORITY_NAME: authority } = env

/** @type {React.FunctionComponent<{}>} */
export const Share = ({ navigation }) => {
  const { t } = useTranslation()

  // TODO: Implement share logic
  const handleButtonPress = () => navigation.push("AssessmentComplete")

  return (
    <AssessmentLayout
      icon={Icons.AnonymizedDataInverted}
      backgroundColor={Colors.invertedSecondaryBackground}
      footer={
        <Button
          onPress={handleButtonPress}
          label={t("assessment.share_cta")}
          style={styles.button}
          textStyle={styles.buttonText}
          testID="assessment-button"
        />
      }
    >
      <InfoText
        title={t("assessment.share_title")}
        description={t("assessment.share_description", { authority })}
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
