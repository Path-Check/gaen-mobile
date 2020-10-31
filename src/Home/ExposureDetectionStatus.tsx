import React, { FunctionComponent } from "react"
import { Alert, Platform, ScrollView, StyleSheet } from "react-native"
import { useTranslation } from "react-i18next"
import { useNavigation } from "@react-navigation/native"

import { useExposureDetectionStatus } from "./useExposureDetectionStatus"
import { useStatusBarEffect, HomeStackScreens } from "../navigation"
import { useSystemServicesContext } from "../SystemServicesContext"
import { useApplicationName } from "../hooks/useApplicationInfo"
import {
  usePermissionsContext,
  ENPermissionStatus,
} from "../PermissionsContext"
import { openAppSettings } from "../Device"
import ActivationStatusView from "./ActivationStatusView"
import { Text } from "../components"

import { Colors, Spacing, Typography } from "../styles"

const ExposureDetectionStatus: FunctionComponent = () => {
  useStatusBarEffect("dark-content", Colors.background.primaryLight)
  const { t } = useTranslation()
  const navigation = useNavigation()
  const { exposureDetectionStatus } = useExposureDetectionStatus()
  const { isBluetoothOn, locationPermissions } = useSystemServicesContext()
  const { exposureNotifications } = usePermissionsContext()
  const { applicationName } = useApplicationName()

  const BluetoothActivationStatus: FunctionComponent = () => {
    const handleOnPressFix = () => {
      showFixBluetoothAlert()
    }

    const handleOnPressShowInfo = () => {
      navigation.navigate(HomeStackScreens.BluetoothInfo)
    }

    const showFixBluetoothAlert = () => {
      Alert.alert(
        t("home.bluetooth.bluetooth_disabled_error_title"),
        t("home.bluetooth.bluetooth_disabled_error_message"),
        [
          {
            text: t("common.back"),
            style: "cancel",
          },
          {
            text: t("common.settings"),
            onPress: () => openAppSettings(),
          },
        ],
      )
    }

    return (
      <ActivationStatusView
        headerText={t("home.bluetooth.bluetooth_header")}
        isActive={isBluetoothOn}
        infoAction={handleOnPressShowInfo}
        fixAction={handleOnPressFix}
        testID={"bluetooth-status-container"}
      />
    )
  }

  const ExposureNotificationsActivationStatus: FunctionComponent = () => {
    const navigation = useNavigation()

    const { status } = exposureNotifications

    const showNotAuthorizedAlert = () => {
      const errorMessage = Platform.select({
        ios: t("home.proximity_tracing.unauthorized_error_message_ios", {
          applicationName,
        }),
        android: t(
          "home.proximity_tracing.unauthorized_error_message_android",
          {
            applicationName,
          },
        ),
      })

      Alert.alert(
        t("home.proximity_tracing.unauthorized_error_title"),
        errorMessage,
        [
          {
            text: t("common.back"),
            style: "cancel",
          },
          {
            text: t("common.settings"),
            onPress: () => openAppSettings(),
          },
        ],
      )
    }

    const handleOnPressFix = async () => {
      try {
        await exposureNotifications.request()

        if (status !== ENPermissionStatus.ENABLED) {
          showNotAuthorizedAlert()
        }
      } catch {
        showNotAuthorizedAlert()
      }
    }

    const handleOnPressShowInfo = () => {
      navigation.navigate(HomeStackScreens.ExposureNotificationsInfo)
    }

    const isENEnabled = status === ENPermissionStatus.ENABLED

    return (
      <ActivationStatusView
        headerText={t("home.bluetooth.proximity_tracing_header")}
        isActive={isENEnabled}
        infoAction={handleOnPressShowInfo}
        fixAction={handleOnPressFix}
        testID={"exposure-notifications-status-container"}
      />
    )
  }

  const LocationActivationStatus: FunctionComponent = () => {
    const handleOnPressFix = () => {
      showFixLocationAlert()
    }

    const handleOnPressShowInfo = () => {
      navigation.navigate(HomeStackScreens.LocationInfo)
    }

    const showFixLocationAlert = () => {
      Alert.alert(
        t("home.bluetooth.location_disabled_error_title"),
        t("home.bluetooth.location_disabled_error_message"),
        [
          {
            text: t("common.back"),
            style: "cancel",
          },
          {
            text: t("common.settings"),
            onPress: () => openAppSettings(),
          },
        ],
      )
    }

    const isLocationOn = locationPermissions === "RequiredOn"

    return (
      <ActivationStatusView
        headerText={t("home.bluetooth.location_header")}
        isActive={isLocationOn}
        infoAction={handleOnPressShowInfo}
        fixAction={handleOnPressFix}
        testID={"location-status-container"}
      />
    )
  }

  const subheaderText = exposureDetectionStatus
    ? t("exposure_scanning_status.your_device_is_scanning")
    : t("exposure_scanning_status.your_device_is_not")

  const locationIsRequired = locationPermissions !== "NotRequired"

  return (
    <ScrollView
      style={style.container}
      contentContainerStyle={style.contentContainer}
    >
      <Text style={style.headerText}>
        {t("screen_titles.exposure_scanning")}
      </Text>
      <Text style={style.subheaderText}>{subheaderText}</Text>
      <BluetoothActivationStatus />
      <ExposureNotificationsActivationStatus />
      {locationIsRequired && <LocationActivationStatus />}
    </ScrollView>
  )
}

const style = StyleSheet.create({
  container: {
    backgroundColor: Colors.background.primaryLight,
  },
  contentContainer: {
    paddingTop: Spacing.medium,
    paddingBottom: Spacing.xxxLarge,
    paddingHorizontal: Spacing.medium,
    backgroundColor: Colors.background.primaryLight,
  },
  headerText: {
    ...Typography.header.x60,
    ...Typography.style.bold,
    marginBottom: Spacing.xSmall,
  },
  subheaderText: {
    ...Typography.body.x30,
    marginBottom: Spacing.xLarge,
  },
})

export default ExposureDetectionStatus
