import React, { FunctionComponent } from "react"
import {
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  View,
} from "react-native"
import { useTranslation } from "react-i18next"
import { useNavigation } from "@react-navigation/native"
import { SvgXml } from "react-native-svg"
import { useSafeAreaInsets, EdgeInsets } from "react-native-safe-area-context"

import { usePermissionsContext, ENStatus } from "../PermissionsContext"
import { Screens, useStatusBarEffect, Stacks } from "../navigation"
import { useApplicationName } from "../hooks/useApplicationInfo"
import { GlobalText, Button, GradientBackground } from "../components"
import { getLocalNames } from "../locales/languages"
import { useBluetoothStatus } from "../useBluetoothStatus"
import { useHasLocationRequirements } from "./useHasLocationRequirements"
import { BluetoothActivationStatus } from "./BluetoothActivationStatus"
import { ProximityTracingActivationStatus } from "./ProximityTracingActivationStatus"
import { LocationActivationStatus } from "./LocationActivationStatus"
import { ShareLink } from "./ShareLink"

import { Icons } from "../assets"
import { Spacing, Colors, Typography, Outlines, Iconography } from "../styles"

const Home: FunctionComponent = () => {
  useStatusBarEffect("light-content")
  const {
    t,
    i18n: { language: localeCode },
  } = useTranslation()
  const navigation = useNavigation()

  const languageName = getLocalNames()[localeCode]
  const { applicationName } = useApplicationName()

  const insets = useSafeAreaInsets()
  const style = createStyle(insets)

  const isBluetoothOn = useBluetoothStatus()
  const {
    isLocationNeeded,
    isLocationOffAndNeeded,
  } = useHasLocationRequirements()
  const { exposureNotifications } = usePermissionsContext()

  const isProximityTracingOn =
    exposureNotifications.status === ENStatus.AUTHORIZED_ENABLED

  const appIsActive =
    isProximityTracingOn && isBluetoothOn && !isLocationOffAndNeeded

  const handleOnPressSelectLanguage = () => {
    navigation.navigate(Screens.LanguageSelection)
  }

  const topIcon = appIsActive ? Icons.CheckInCircle : Icons.XInCircle
  const topIconFill = appIsActive ? Colors.success100 : Colors.danger75
  const topIconAccessibilityLabel = appIsActive
    ? t("status_icon_active_label")
    : t("status_icon_inactive_label")
  const headerText = appIsActive
    ? t("home.bluetooth.tracing_on_header")
    : t("home.bluetooth.tracing_off_header")
  const subheaderText = () => {
    switch (appIsActive) {
      case true:
        return t("home.bluetooth.all_services_on_subheader", {
          applicationName,
        })
      case false:
        return isLocationNeeded
          ? t("home.bluetooth.tracing_off_subheader_location")
          : t("home.bluetooth.tracing_off_subheader")
    }
  }

  return (
    <>
      <View style={style.statusBarContainer}>
        <StatusBar />
      </View>
      <ScrollView
        style={style.container}
        contentContainerStyle={style.contentContainer}
      >
        <View style={style.topScrollViewBackground} />
        <GradientBackground
          gradient={Colors.gradientPrimary100}
          angleCenterY={1}
        >
          <View style={style.topContainer}>
            <TouchableOpacity
              onPress={handleOnPressSelectLanguage}
              style={style.languageButtonContainer}
            >
              <GlobalText style={style.languageButtonText}>
                {languageName}
              </GlobalText>
            </TouchableOpacity>
            <View style={style.topIcon}>
              <SvgXml
                xml={topIcon}
                width={Iconography.large}
                height={Iconography.large}
                fill={topIconFill}
                accessible
                accessibilityLabel={topIconAccessibilityLabel}
              />
            </View>
            <GlobalText style={style.headerText} testID={"home-header"}>
              {headerText}
            </GlobalText>
            <GlobalText style={style.subheaderText} testID={"home-subheader"}>
              {subheaderText()}
            </GlobalText>
          </View>
        </GradientBackground>
        <View style={style.bottomContainer}>
          <ShareLink />
          <BluetoothActivationStatus />
          <ProximityTracingActivationStatus />
          <LocationActivationStatus />
          <View style={style.buttonContainer}>
            <Button
              onPress={() => navigation.navigate(Stacks.AffectedUserStack)}
              label={t("home.bluetooth.report_positive_result")}
              customButtonStyle={style.button}
              hasRightArrow
            />
          </View>
        </View>
      </ScrollView>
    </>
  )
}

const createStyle = (insets: EdgeInsets) => {
  /* es-lint-disable-no-unused-styles */
  return StyleSheet.create({
    statusBarContainer: {
      height: insets.top,
      backgroundColor: Colors.gradientPrimary100Lighter,
    },
    topScrollViewBackground: {
      position: "absolute",
      top: "-100%",
      left: 0,
      right: 0,
      backgroundColor: Colors.gradientPrimary100Lighter,
      height: "100%",
    },
    container: {
      backgroundColor: Colors.primaryLightBackground,
    },
    contentContainer: {
      paddingBottom: Spacing.large,
      backgroundColor: Colors.primaryLightBackground,
    },
    topContainer: {
      width: "100%",
      alignItems: "center",
      paddingTop: Spacing.xxSmall,
      paddingBottom: Spacing.xLarge,
    },
    languageButtonContainer: {
      alignSelf: "center",
      paddingVertical: Spacing.xxSmall,
      paddingHorizontal: Spacing.large,
      backgroundColor: Colors.transparentNeutral30,
      borderRadius: Outlines.borderRadiusMax,
      marginBottom: Spacing.large,
    },
    languageButtonText: {
      ...Typography.body3,
      letterSpacing: Typography.xLargeLetterSpacing,
      color: Colors.primary150,
      textAlign: "center",
      textTransform: "uppercase",
    },
    topIcon: {
      backgroundColor: Colors.white,
      borderRadius: Outlines.borderRadiusMax,
      padding: 10,
      marginBottom: Spacing.large,
    },
    headerText: {
      ...Typography.header1,
      ...Typography.mediumBold,
      color: Colors.white,
      textAlign: "center",
      marginBottom: Spacing.xxSmall,
    },
    subheaderText: {
      ...Typography.body1,
      fontSize: Typography.large,
      paddingHorizontal: Spacing.medium,
      color: Colors.white,
      textAlign: "center",
      marginBottom: Spacing.xxSmall,
    },
    bottomContainer: {
      backgroundColor: Colors.primaryLightBackground,
    },
    buttonContainer: {
      paddingTop: Spacing.medium,
      paddingHorizontal: Spacing.small,
    },
    button: {
      alignSelf: "center",
      width: "100%",
    },
  })
}

export default Home
