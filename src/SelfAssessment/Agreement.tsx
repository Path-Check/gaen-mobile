import React, { FunctionComponent } from "react"
import { StyleSheet } from "react-native"
import { useTranslation } from "react-i18next"
import { useNavigation } from "@react-navigation/native"

import InfoText from "./InfoText"
import { Button } from "../components/Button"
import { AssessmentLayout } from "./AssessmentLayout"
import { RTLEnabledText } from "../components/RTLEnabledText"

import { Colors, Typography } from "../styles"
import { Icons } from "../assets"

const Agreement: FunctionComponent = () => {
  const { t } = useTranslation()
  const navigation = useNavigation()

  const handleOnPressAgreement = () => {
    navigation.navigate("EmergencyAssessment")
  }

  return (
    <AssessmentLayout
      backgroundColor={Colors.invertedPrimaryBackground}
      icon={Icons.SelfAssessment}
      footer={
        <AgreementFooter
          description={t("assessment.agreement_footer")}
          buttonTitle={t("assessment.agreement_cta")}
          onPress={handleOnPressAgreement}
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

interface AgreementFooterProps {
  description: string
  onPress: () => void
  buttonTitle: string
}

const AgreementFooter: FunctionComponent<AgreementFooterProps> = ({
  description,
  onPress,
  buttonTitle,
}) => (
  <>
    <Button onPress={onPress} label={buttonTitle} />
    <RTLEnabledText style={style.typographyStyle}>{description}</RTLEnabledText>
  </>
)

const style = StyleSheet.create({
  typographyStyle: {
    paddingTop: 10,
    ...Typography.quaternaryContent,
  },
})

export default Agreement
