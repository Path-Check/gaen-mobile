import React, { FunctionComponent } from "react"
import { ScrollView, StyleSheet } from "react-native"
import { useTranslation } from "react-i18next"

import { Text } from "../components"
import { useStatusBarEffect } from "../navigation"

import BluetoothActivationStatus from "./BluetoothActivationStatus"
import ExposureNotificationsActivationStatus from "./ExposureNotificationsActivationStatus"
import LocationActivationStatus from "./LocationActivationStatus"
import { useExposureDetectionStatus } from "./useExposureDetectionStatus"
import { useSystemServicesContext } from "../SystemServicesContext"

import { Colors, Spacing, Typography } from "../styles"

const ExposureDetectionStatus: FunctionComponent = () => {
  useStatusBarEffect("dark-content", Colors.primaryLightBackground)
  const { t } = useTranslation()
  const { exposureDetectionStatus } = useExposureDetectionStatus()
  const { locationPermissions } = useSystemServicesContext()

  const subheaderText = exposureDetectionStatus
    ? t("exposure_scanning_status.your_device_is_scanning")
    : t("exposure_scanning_status.your_device_is_not")

  const locationIsNotRequired = locationPermissions !== "NotRequired"

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
      {locationIsNotRequired && <LocationActivationStatus />}
    </ScrollView>
  )
}

const style = StyleSheet.create({
  container: {
    backgroundColor: Colors.primaryLightBackground,
  },
  contentContainer: {
    paddingTop: Spacing.medium,
    paddingBottom: Spacing.xxxLarge,
    paddingHorizontal: Spacing.medium,
    backgroundColor: Colors.primaryLightBackground,
  },
  headerText: {
    ...Typography.header1,
    ...Typography.bold,
    marginBottom: Spacing.xSmall,
  },
  subheaderText: {
    ...Typography.body1,
    marginBottom: Spacing.xLarge,
  },
})

export default ExposureDetectionStatus
