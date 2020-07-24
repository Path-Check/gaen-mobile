import React, { useContext } from "react"
import { useTranslation } from "react-i18next"
import {StyleSheet} from "react-native"

import { AssessmentNavigationContext } from "../Context"
import { Info } from "../Info"
import { InfoText } from "../InfoText"
import { Button } from "../../components/Button"

import { Icons, Images } from "../../assets"
import { Colors } from "../../styles"

/** @type {React.FunctionComponent<{}>} */
export const Distancing = ({ navigation }) => {
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
          label={t("assessment.distancing_cta")}
          style={styles.button}
          textStyle={styles.buttonText}
        />
      }
    >
      <InfoText
        title={t("assessment.distancing_title")}
        description={t("assessment.distancing_description")}
      />
    </Info>
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
