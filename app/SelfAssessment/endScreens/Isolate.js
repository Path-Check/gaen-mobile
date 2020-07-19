import React, { useContext } from "react"
import { useTranslation } from "react-i18next"

import { AssessmentNavigationContext } from "../Context"
import { Info } from "../Info"
import { InfoText } from "../InfoText"
import { Button } from "../Button"

import { Icons, Images } from "../../assets"
import { Colors } from "../../styles"

/** @type {React.FunctionComponent<{}>} */
export const Isolate = ({ navigation }) => {
  let { t } = useTranslation()
  let { completeRoute } = useContext(AssessmentNavigationContext)

  const handleButtonPress = () => navigation.push(completeRoute)

  return (
    <Info
      backgroundColor={Colors.primaryBackgroundFaintShade}
      backgroundImage={Images.IsolatePathBackground}
      icon={Icons.Isolate}
      footer={
        <Button
          onPress={handleButtonPress}
          title={t("assessment.isolate_cta")}
        />
      }
    >
      <InfoText
        title={t("assessment.isolate_title")}
        description={t("assessment.isolate_description")}
      />
    </Info>
  )
}
