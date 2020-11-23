import React, { FunctionComponent } from "react"
import { Alert, Platform, ScrollView, StyleSheet } from "react-native"
import { useTranslation } from "react-i18next"
import { useNavigation } from "@react-navigation/native"

import { useApplicationName } from "../../Device/useApplicationInfo"
import { useExposureDetectionStatus } from "../../Device/useExposureDetectionStatus"
import { usePermissionsContext } from "../../Device/PermissionsContext"
import { useProductAnalyticsContext } from "../../ProductAnalytics/Context"
import { openAppSettings } from "../../Device"
import { useStatusBarEffect, HomeStackScreens } from "../../navigation"
import { Text } from "../../components"

import ActivationStatusView from "../ActivationStatusView"

import { Colors, Spacing, Typography } from "../../styles"

const ExposureDetectionStatus: FunctionComponent = () => {
  useStatusBarEffect("dark-content", Colors.background.primaryLight)
  const { t } = useTranslation()
  const navigation = useNavigation()
  const { exposureDetectionStatus } = useExposureDetectionStatus()
  const { trackEvent } = useProductAnalyticsContext()
  const { exposureNotifications, locationPermissions } = usePermissionsContext()
  const { applicationName } = useApplicationName()

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

    const showEnableBluetoothAlert = () => {
      Alert.alert(
        t("onboarding.activate_exposure_notifications.bluetooth_header", {
          applicationName,
        }),
        t("onboarding.activate_exposure_notifications.bluetooth_body"),
        [
          {
            text: t("common.back"),
            style: "cancel",
          },
          {
            text: t("common.settings"),
            onPress: () => {
              openAppSettings()
            },
          },
        ],
      )
    }

    const handleOnPressFix = async () => {
      try {
        const response = await exposureNotifications.request()
        if (response.kind === "success") {
          if (response.status === "BluetoothOff") {
            showEnableBluetoothAlert()
          } else {
            showNotAuthorizedAlert()
          }
        } else {
          showNotAuthorizedAlert()
        }
        trackEvent("product_analytics", "onboarding_en_permissions_accept")
      } catch (e) {
        showNotAuthorizedAlert()
      }
    }

    const handleOnPressShowInfo = () => {
      navigation.navigate(HomeStackScreens.ExposureNotificationsInfo)
    }

    return (
      <ActivationStatusView
        headerText={t("home.bluetooth.proximity_tracing_header")}
        isActive={status === "Active"}
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
        subheaderText={t("home.bluetooth.location_subheader", {
          applicationName,
        })}
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
