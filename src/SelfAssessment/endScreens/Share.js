import React from "react"
import { useTranslation } from "react-i18next"
import env from "react-native-config"

import { Info } from "../Info"
import { InfoText } from "../InfoText"
import { Button } from "../Button"

import { Icons } from "../../assets"
import { Colors } from "../../styles"

const { GAEN_AUTHORITY_NAME: authority } = env

/** @type {React.FunctionComponent<{}>} */
export const Share = ({ navigation }) => {
  const { t } = useTranslation()

  // TODO: Implement share logic
  const handleButtonPress = () => navigation.push("AssessmentComplete")

  return (
    <Info
      icon={Icons.AnonymizedDataInverted}
      backgroundColor={Colors.invertedSecondaryBackground}
      footer={
        <Button
          onPress={handleButtonPress}
          title={t("assessment.share_cta")}
          backgroundColor={Colors.white}
          textColor={Colors.black}
        />
      }
    >
      <InfoText
        title={t("assessment.share_title")}
        description={t("assessment.share_description", { authority })}
      />
    </Info>
  )
}
