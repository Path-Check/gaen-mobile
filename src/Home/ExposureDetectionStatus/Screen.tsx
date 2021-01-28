import React, { FunctionComponent } from "react"
import { ScrollView, StyleSheet } from "react-native"
import { useTranslation } from "react-i18next"
import { useNavigation } from "@react-navigation/native"

import { useApplicationName } from "../../Device/useApplicationInfo"
import { usePermissionsContext } from "../../Device/PermissionsContext"
import { useProductAnalyticsContext } from "../../ProductAnalytics/Context"
import { useStatusBarEffect, HomeStackScreens } from "../../navigation"
import { Text } from "../../components"
import ActivationStatusView from "../ActivationStatusView"
import { useDeviceAlert } from "../../Device/useDeviceAlert"
import { useRequestExposureNotifications } from "../../useRequestExposureNotifications"

import { Colors, Spacing, Typography } from "../../styles"

const ExposureDetectionStatus: FunctionComponent = () => {
  useStatusBarEffect("dark-content", Colors.background.primaryLight)
  const { t } = useTranslation()
  const { exposureNotifications, locationRequirement } = usePermissionsContext()

  const subheaderText =
    exposureNotifications.status === "Active"
      ? t("exposure_scanning_status.your_device_is_scanning")
      : t("exposure_scanning_status.your_device_is_not")

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
      {locationRequirement === "Required" && <LocationActivationStatus />}
    </ScrollView>
  )
}

const ExposureNotificationsActivationStatus: FunctionComponent = () => {
  const { t } = useTranslation()
  const navigation = useNavigation()
  const { trackEvent } = useProductAnalyticsContext()
  const { exposureNotifications } = usePermissionsContext()
  const requestExposureNotifications = useRequestExposureNotifications()

  const handleOnPressFix = async () => {
    trackEvent("product_analytics", "onboarding_en_permissions_accept")
    requestExposureNotifications()
  }

  const handleOnPressShowInfo = () => {
    navigation.navigate(HomeStackScreens.ExposureNotificationsInfo)
  }

  const isActive = exposureNotifications.status === "Active"

  return (
    <ActivationStatusView
      headerText={t("home.bluetooth.proximity_tracing_header")}
      isActive={isActive}
      infoAction={handleOnPressShowInfo}
      fixAction={handleOnPressFix}
      testID={"exposure-notifications-status-container"}
    />
  )
}

const LocationActivationStatus: FunctionComponent = () => {
  const { t } = useTranslation()
  const navigation = useNavigation()
  const { applicationName } = useApplicationName()
  const { showFixLocationAlert } = useDeviceAlert()
  const { exposureNotifications } = usePermissionsContext()

  const handleOnPressFix = () => {
    showFixLocationAlert()
  }

  const handleOnPressShowInfo = () => {
    navigation.navigate(HomeStackScreens.LocationInfo)
  }

  const isLocationOn = exposureNotifications.status !== "LocationOffAndRequired"

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
