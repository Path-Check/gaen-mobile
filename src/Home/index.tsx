import React, { FunctionComponent } from "react"
import {
  ScrollView,
  TouchableOpacity,
  Platform,
  StyleSheet,
  SafeAreaView,
  ImageBackground,
  View,
} from "react-native"
import { useSafeAreaInsets, EdgeInsets } from "react-native-safe-area-context"
import { useTranslation } from "react-i18next"
import { useNavigation } from "@react-navigation/native"

import { usePermissionsContext, ENStatus } from "../PermissionsContext"
import { Screens, useStatusBarEffect, Stacks } from "../navigation"
import { useApplicationName } from "../hooks/useApplicationInfo"
import { GlobalText, Button } from "../components"
import { getLocalNames } from "../locales/languages"
import { useBluetoothStatus } from "../useBluetoothStatus"
import { useHasLocationRequirements } from "./useHasLocationRequirements"

import { Images } from "../assets"
import { Spacing, Colors, Typography, Layout, Outlines } from "../styles"
import { ShareLink } from "./ShareLink"
import { BluetoothActivationStatus } from "./BluetoothActivationStatus"
import { ProximityTracingActivationStatus } from "./ProximityTracingActivationStatus"
import { LocationActivationStatus } from "./LocationActivationStatus"

const HomeScreen: FunctionComponent = () => {
  useStatusBarEffect("light-content")
  const {
    t,
    i18n: { language: localeCode },
  } = useTranslation()
  const navigation = useNavigation()

  const languageName = getLocalNames()[localeCode]
  const { applicationName } = useApplicationName()

  const isBluetoothOn = useBluetoothStatus()
  const { isLocationOffAndNeeded } = useHasLocationRequirements()
  const { exposureNotifications } = usePermissionsContext()

  const isProximityTracingOn =
    exposureNotifications.status === ENStatus.AUTHORIZED_ENABLED

  const appIsActive =
    isProximityTracingOn && isBluetoothOn && !isLocationOffAndNeeded

  const handleOnPressSelectLanguage = () => {
    navigation.navigate(Screens.LanguageSelection)
  }

  const insets = useSafeAreaInsets()
  const style = createStyles(insets)

  const backgroundImage = appIsActive ? Images.HomeActive : Images.HomeInactive
  const headerText = appIsActive
    ? t("home.bluetooth.tracing_on_header")
    : t("home.bluetooth.tracing_off_header")
  const subheaderText = appIsActive
    ? t("home.bluetooth.all_services_on_subheader", { applicationName })
    : t("home.bluetooth.tracing_off_subheader")

  return (
    <View style={style.container}>
      <ImageBackground style={style.backgroundImage} source={backgroundImage} />
      <View style={style.languageButtonOuterContainer}>
        <TouchableOpacity
          onPress={handleOnPressSelectLanguage}
          style={style.languageButtonContainer}
        >
          <GlobalText style={style.languageButtonText}>
            {languageName}
          </GlobalText>
        </TouchableOpacity>
      </View>
      <View style={style.textContainer}>
        <GlobalText style={style.headerText} testID={"home-header"}>
          {headerText}
        </GlobalText>
        <GlobalText style={style.subheaderText} testID={"home-subheader"}>
          {subheaderText}
        </GlobalText>
      </View>
      <SafeAreaView style={style.bottomContainer}>
        <ScrollView contentContainerStyle={style.bottomContentContainer}>
          <ShareLink />
          <View style={style.activationStatusSectionContainer}>
            <BluetoothActivationStatus />
            <ProximityTracingActivationStatus />
            <LocationActivationStatus />
          </View>
          <View style={style.buttonContainer}>
            <Button
              onPress={() => navigation.navigate(Stacks.AffectedUserStack)}
              label={t("home.bluetooth.report_positive_result")}
              customButtonStyle={style.button}
              hasRightArrow
            />
          </View>
        </ScrollView>
      </SafeAreaView>
    </View>
  )
}

const createStyles = (insets: EdgeInsets) => {
  const iosMaxHeight = insets.bottom + Layout.screenHeight * 0.475 - 10
  const androidMaxHeight = insets.bottom + Layout.screenHeight * 0.475 - 30
  const iosTopSpacing = Layout.screenHeight * 0.225 - insets.top + 55
  const androidTopSpacing = Layout.screenHeight * 0.225 - insets.top + 80
  const iosPaddingTop = Layout.screenHeight * 0.5 - insets.top + 300
  const androidPaddingTop = 680

  /*eslint-disable react-native/no-unused-styles */
  return StyleSheet.create({
    container: {
      flex: 1,
    },
    backgroundImage: {
      width: "100%",
      paddingTop: Platform.select({
        ios: iosPaddingTop,
        android: androidPaddingTop,
      }),
    },
    languageButtonOuterContainer: {
      position: "absolute",
      top: Layout.oneTwentiethHeight,
      width: "100%",
    },
    languageButtonContainer: {
      alignSelf: "center",
      paddingVertical: Spacing.xxSmall,
      paddingHorizontal: Spacing.large,
      backgroundColor: Colors.transparentNeutral30,
      borderRadius: Outlines.borderRadiusMax,
    },
    languageButtonText: {
      ...Typography.body3,
      letterSpacing: Typography.xLargeLetterSpacing,
      color: Colors.primary150,
      textAlign: "center",
      textTransform: "uppercase",
    },
    textContainer: {
      alignSelf: "center",
      marginHorizontal: Spacing.medium,
      position: "absolute",
      alignItems: "center",
      top: Platform.select({
        ios: iosTopSpacing,
        android: androidTopSpacing,
      }),
    },
    headerText: {
      ...Typography.header1,
      color: Colors.white,
      textAlign: "center",
      marginBottom: Spacing.xxSmall,
    },
    subheaderText: {
      ...Typography.body1,
      fontSize: Typography.large,
      color: Colors.white,
      textAlign: "center",
      marginBottom: Spacing.xxSmall,
    },
    bottomContainer: {
      position: "absolute",
      bottom: 0,
      width: "100%",
      backgroundColor: Colors.primaryLightBackground,
      maxHeight: Platform.select({
        ios: iosMaxHeight,
        android: androidMaxHeight,
      }),
    },
    bottomContentContainer: {
      paddingBottom: Spacing.large,
    },
    activationStatusSectionContainer: {
      marginBottom: Spacing.medium,
    },
    buttonContainer: {
      paddingHorizontal: Spacing.small,
    },
    button: {
      alignSelf: "center",
      width: "100%",
    },
  })
}

export default HomeScreen
