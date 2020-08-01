import React, { useContext } from "react"
import { useTranslation } from "react-i18next"
import { StyleSheet } from "react-native"

import { AssessmentNavigationContext } from "../Context"
import { AssessmentLayout } from "../AssessmentLayout"
import InfoText from "../InfoText"
import { Button } from "../../components/Button"

import { Icons, Images } from "../../assets"
import { Colors } from "../../styles"

/** @type {React.FunctionComponent<{}>} */
export const Caregiver = ({ navigation }) => {
  const { t } = useTranslation()
  const { completeRoute } = useContext(AssessmentNavigationContext)

  const handleButtonPress = () => navigation.push(completeRoute)

  return (
    <AssessmentLayout
      backgroundColor={Colors.primaryBackgroundFaintShade}
      backgroundImage={Images.IsolatePathBackground}
      icon={Icons.Isolate}
      footer={
        <Button
          onPress={handleButtonPress}
          label={t("assessment.caregiver_cta")}
          buttonStyle={style.button}
          textStyle={style.buttonText}
          testID="assessment-button"
        />
      }
    >
      <InfoText
        title={t("assessment.caregiver_title")}
        description={t("assessment.caregiver_description")}
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
