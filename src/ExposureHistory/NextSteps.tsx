import React from "react"
import { TouchableOpacity, View, StyleSheet, Linking } from "react-native"
import { useNavigation } from "@react-navigation/native"
import { useTranslation } from "react-i18next"
import { SvgXml } from "react-native-svg"
import env from "react-native-config"

import { displayNextSteps } from "../utils"

import { RTLEnabledText } from "../components/RTLEnabledText"
import { NavigationBarWrapper } from "../components/NavigationBarWrapper"
import { Screens, useStatusBarEffect } from "../navigation"

import { Buttons, Spacing, Typography } from "../styles"
import { Icons } from "../assets"

import { Colors } from "../styles"

const { GAEN_AUTHORITY_NAME: healthAuthorityName, AUTHORITY_ADVICE_URL } = env

const NextSteps = (): JSX.Element => {
  const navigation = useNavigation()
  const { t } = useTranslation()
  useStatusBarEffect("light-content")

  const handleOnBackPress = () => {
    navigation.goBack()
  }

  const footerText = t("exposure_history.next_steps.ha_self_assessment", {
    healthAuthorityName,
  })
  const contentTextOne = t("exposure_history.next_steps.possible_crossed_paths")
  const contentTextTwo = t(
    "exposure_history.next_steps.possible_infection_precaution",
  )
  const buttonText = t("exposure_history.next_steps.button_text")

  const handleOnPressTakeAssessment = () => {
    AUTHORITY_ADVICE_URL
      ? Linking.openURL(AUTHORITY_ADVICE_URL)
      : navigation.navigate(Screens.SelfAssessment)
  }

  return (
    <NavigationBarWrapper title={"Next Steps"} onBackPress={handleOnBackPress}>
      <View style={styles.container}>
        <View style={styles.headerContainer}>
          <RTLEnabledText style={styles.contentText}>
            {contentTextOne}
          </RTLEnabledText>
          <RTLEnabledText style={styles.contentText}>
            {contentTextTwo}
          </RTLEnabledText>
        </View>
        {displayNextSteps() && (
          <View style={styles.buttonContainer}>
            <RTLEnabledText style={styles.footerText}>
              {footerText}
            </RTLEnabledText>
            <TouchableOpacity
              style={styles.button}
              onPress={handleOnPressTakeAssessment}
            >
              <RTLEnabledText style={styles.buttonText}>
                {buttonText}
              </RTLEnabledText>
              <SvgXml xml={Icons.Export} color={Colors.white} />
            </TouchableOpacity>
          </View>
        )}
      </View>
    </NavigationBarWrapper>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: Spacing.medium,
  },
  headerContainer: {
    flex: 1,
  },
  footerText: {
    ...Typography.footer,
    marginBottom: Spacing.medium,
  },
  contentText: {
    ...Typography.mainContent,
    paddingTop: Spacing.small,
  },
  buttonContainer: {
    flex: 1,
    justifyContent: "flex-end",
  },
  button: {
    ...Buttons.largeBlue,
    padding: Spacing.xxLarge,
    justifyContent: "space-between",
  },
  buttonText: {
    ...Typography.buttonTextLight,
  },
})

export default NextSteps
