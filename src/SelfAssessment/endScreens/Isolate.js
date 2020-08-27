import React, { useContext } from "react"
import { useTranslation } from "react-i18next"
import { StyleSheet } from "react-native"

import { AssessmentNavigationContext } from "../Context"
import { AssessmentLayout } from "../AssessmentLayout"
import InfoText from "../InfoText"
import { Button } from "../../components"

import { Icons, Images } from "../../assets"
import { Colors } from "../../styles"

/** @type {React.FunctionComponent<{}>} */
export const Isolate = ({ navigation }) => {
  const { t } = useTranslation()
  const { completeRoute } = useContext(AssessmentNavigationContext)

  const handleButtonPress = () => navigation.push(completeRoute)

  return (
    <AssessmentLayout
      backgroundColor={Colors.primaryLightBackground}
      backgroundImage={Images.IsolatePathBackground}
      icon={Icons.Isolate}
      footer={
        <Button
          onPress={handleButtonPress}
          label={t("assessment.isolate_cta")}
          customButtonStyle={style.button}
          customTextStyle={style.buttonText}
          testID="assessment-button"
        />
      }
    >
      <InfoText
        title={t("assessment.isolate_title")}
        description={t("assessment.isolate_description")}
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
