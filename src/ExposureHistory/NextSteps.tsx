import React, { useEffect, useState } from "react"
import { TouchableOpacity, View, StyleSheet, Linking } from "react-native"
import { useNavigation } from "@react-navigation/native"
import { useTranslation } from "react-i18next"
import { SvgXml } from "react-native-svg"
import NetInfo from "@react-native-community/netinfo"
import env from "react-native-config"

import { RTLEnabledText } from "../components/RTLEnabledText"
import { Screens, useStatusBarEffect } from "../navigation"

import { Buttons, Spacing, Typography } from "../styles"
import { Icons } from "../assets"

import { Colors } from "../styles"

const {
  GAEN_AUTHORITY_NAME: healthAuthorityName,
  AUTHORITY_ADVICE_URL,
  DISPLAY_SELF_ASSESSMENT,
} = env

const CloseButton = () => {
  const navigation = useNavigation()

  return (
    <TouchableOpacity
      onPress={() => navigation.goBack()}
      style={styles.backIconContainer}
    >
      <SvgXml xml={Icons.Close} fill={Colors.quaternaryViolet} />
    </TouchableOpacity>
  )
}

const NextSteps = (): JSX.Element => {
  const navigation = useNavigation()
  const [connectivity, setConnectivity] = useState<boolean | null | undefined>(null) 
  const { t } = useTranslation()
  useStatusBarEffect("dark-content")

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      setConnectivity(state.isInternetReachable)
    });
    return () => {
      unsubscribe()
    }  
  }, [])

  const displayNextSteps =
    DISPLAY_SELF_ASSESSMENT === "true" || AUTHORITY_ADVICE_URL

  const headerText = t("exposure_history.next_steps.maybe_exposed")
  const contentTextOne = t("exposure_history.next_steps.possible_crossed_paths")
  const contentTextTwo = t(
    "exposure_history.next_steps.possible_infection_precaution",
  )
  const footerText = t("exposure_history.next_steps.ha_self_assessment", {
    healthAuthorityName,
  })
  const buttonText = t("exposure_history.next_steps.button_text")
  const noConnectivityMessage = t("exposure_history.next_steps.no_connectivity_message")

  const handleOnPressTakeAssessment = () => {
    AUTHORITY_ADVICE_URL
      ? Linking.openURL(AUTHORITY_ADVICE_URL)
      : navigation.navigate(Screens.SelfAssessment)
  }

  return (
    <>
      <CloseButton />
      <View style={styles.container}>
        <View style={styles.headerContainer}>
          <RTLEnabledText style={styles.headerText}>
            {headerText}
          </RTLEnabledText>
          <RTLEnabledText style={styles.contentText}>
            {contentTextOne}
          </RTLEnabledText>
          <RTLEnabledText style={styles.contentText}>
            {contentTextTwo}
          </RTLEnabledText>
        </View>
        {displayNextSteps && (
          <View style={styles.buttonContainer}>
            {!connectivity && <RTLEnabledText style={styles.connectivityWarningText}>
              {noConnectivityMessage}
            </RTLEnabledText>}
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
    </>
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
  connectivityWarningText: {
    color: Colors.red,
    marginBottom: Spacing.xxSmall,
  },
  footerText: {
    ...Typography.footer,
    marginBottom: Spacing.medium,
  },
  headerText: {
    ...Typography.header3,
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
  backIconContainer: {
    marginTop: Spacing.medium,
    padding: Spacing.medium,
    alignItems: "flex-end",
  },
})

export default NextSteps
