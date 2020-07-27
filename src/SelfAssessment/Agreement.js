import React from "react"
import { StyleSheet } from "react-native"
import { useTranslation } from "react-i18next"

import { InfoText } from "./InfoText"
import { Button } from "../components/Button"
import { AssessmentLayout } from "./AssessmentLayout"
import { RTLEnabledText } from "../components/RTLEnabledText"

import { Colors, Typography } from "../styles"
import { Icons } from "../assets"

/** @type {React.FunctionComponent<{}>} */
export const Agreement = ({ navigation }) => {
  let { t } = useTranslation()

  const handleAgreementPress = () => navigation.push("EmergencyAssessment")

  return (
    <AssessmentLayout
      backgroundColor={Colors.invertedPrimaryBackground}
      icon={Icons.SelfAssessment}
      footer={
        <AgreementFooter
          description={t("assessment.agreement_footer")}
          buttonTitle={t("assessment.agreement_cta")}
          onPress={handleAgreementPress}
        />
      }
    >
      <InfoText
        title={t("assessment.agreement_title")}
        description={t("assessment.agreement_description")}
      />
    </AssessmentLayout>
  )
}

const AgreementFooter = ({ description, onPress, buttonTitle }) => (
  <>
    <Button onPress={onPress} label={buttonTitle} />
    <RTLEnabledText style={styles.typographyStyle}>
      {description}
    </RTLEnabledText>
  </>
)

const styles = StyleSheet.create({
  typographyStyle: {
    paddingTop: 10,
    ...Typography.quaternaryContent,
  },
})
