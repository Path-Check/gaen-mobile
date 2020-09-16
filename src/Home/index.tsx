import React, { FunctionComponent } from "react"
import { ScrollView, TouchableOpacity, StyleSheet, View } from "react-native"
import { useTranslation } from "react-i18next"
import { useNavigation } from "@react-navigation/native"
import { SvgXml } from "react-native-svg"

import {
  usePermissionsContext,
  ENPermissionStatus,
} from "../PermissionsContext"
import { useSystemServicesContext } from "../SystemServicesContext"
import { ModalScreens, useStatusBarEffect, Stacks } from "../navigation"
import { useApplicationName } from "../hooks/useApplicationInfo"
import {
  StatusBar,
  GlobalText,
  Button,
  GradientBackground,
} from "../components"

import { BluetoothActivationStatus } from "./BluetoothActivationStatus"
import { ProximityTracingActivationStatus } from "./ProximityTracingActivationStatus"
import { LocationActivationStatus } from "./LocationActivationStatus"
import { ShareLink } from "./ShareLink"

import { Icons } from "../assets"
import { Spacing, Colors, Typography, Outlines, Iconography } from "../styles"

const Home: FunctionComponent = () => {
  useStatusBarEffect("light-content", Colors.gradientPrimary100Lighter)
  const { t } = useTranslation()
  const navigation = useNavigation()

  const { applicationName } = useApplicationName()

  const { isBluetoothOn, locationPermissions } = useSystemServicesContext()
  const isLocationRequiredAndOff = locationPermissions === "RequiredOff"
  const isLocationRequired = locationPermissions !== "NotRequired"

  const { exposureNotifications } = usePermissionsContext()
  const isProximityTracingOn =
    exposureNotifications.status === ENPermissionStatus.ENABLED

  const appIsActive =
    isProximityTracingOn && isBluetoothOn && !isLocationRequiredAndOff

  const handleOnPressSettings = () => {
    navigation.navigate(Stacks.Settings)
  }

  const handleOnPressReportTestResult = () => {
    navigation.navigate(Stacks.Modal, {
      screen: ModalScreens.AffectedUserStack,
    })
  }

  const topIcon = appIsActive ? Icons.CheckInCircle : Icons.XInCircle
  const topIconFill = appIsActive ? Colors.success100 : Colors.danger75
  const topIconAccessibilityLabel = appIsActive
    ? t("home.status_icon_active_label")
    : t("home.status_icon_inactive_label")
  const headerText = appIsActive
    ? t("home.bluetooth.tracing_on_header")
    : t("home.bluetooth.tracing_off_header")
  const subheaderText = () => {
    if (appIsActive) {
      return t("home.bluetooth.all_services_on_subheader", {
        applicationName,
      })
    } else {
      return isLocationRequired
        ? t("home.bluetooth.tracing_off_subheader_location")
        : t("home.bluetooth.tracing_off_subheader")
    }
  }

  const SettingsButton = () => {
    return (
      <TouchableOpacity
        style={style.settingsButtonContainer}
        accessible
        accessibilityLabel={t("home.open_settings")}
        onPress={handleOnPressSettings}
      >
        <SvgXml
          xml={Icons.Gear}
          width={Iconography.small}
          height={Iconography.small}
          fill={Colors.white}
        />
      </TouchableOpacity>
    )
  }

  return (
    <>
      <StatusBar backgroundColor={Colors.gradientPrimary100Lighter} />
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
            <SettingsButton />
            <View style={style.topIcon}>
              <SvgXml
                xml={topIcon}
                width={Iconography.medium}
                height={Iconography.medium}
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
              onPress={handleOnPressReportTestResult}
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

const style = StyleSheet.create({
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
    paddingTop: Spacing.small,
    paddingBottom: Spacing.xLarge,
  },
  settingsButtonContainer: {
    position: "absolute",
    top: 0,
    right: 0,
    padding: Spacing.medium,
  },
  topIcon: {
    backgroundColor: Colors.white,
    borderRadius: Outlines.borderRadiusMax,
    padding: 10,
    marginBottom: Spacing.large,
  },
  headerText: {
    ...Typography.header2,
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
    paddingTop: Spacing.xSmall,
    paddingBottom: Spacing.xSmall + 1,
  },
})

export default Home
