import React, { FunctionComponent } from "react"
import {
  ScrollView,
  SafeAreaView,
  View,
  StyleSheet,
  TouchableOpacity,
} from "react-native"
import { useTranslation } from "react-i18next"
import { useNavigation } from "@react-navigation/native"

import { usePermissionsContext } from "../Device/PermissionsContext"
import { useProductAnalyticsContext } from "../ProductAnalytics/Context"
import { nextScreenFromExposureNotifications } from "./activationStackController"
import { Text } from "../components"

import { Spacing, Typography, Buttons, Colors } from "../styles"

const ActivateExposureNotifications: FunctionComponent = () => {
  const { t } = useTranslation()
  const navigation = useNavigation()
  const {
    locationPermissions,
    isBluetoothOn,
    exposureNotifications,
  } = usePermissionsContext()

  const { trackEvent } = useProductAnalyticsContext()
  const isLocationRequiredAndOff = locationPermissions === "RequiredOff"

  const navigateToNextScreen = () => {
    navigation.navigate(
      nextScreenFromExposureNotifications({
        isLocationRequiredAndOff,
        isBluetoothOn,
      }),
    )
  }

  const handleOnPressActivateExposureNotifications = async () => {
    await exposureNotifications.request()
    trackEvent("product_analytics", "onboarding_en_permissions_accept")
    navigateToNextScreen()
  }

  const handleOnPressDontEnable = () => {
    trackEvent("product_analytics", "onboarding_en_permissions_denied")
    navigateToNextScreen()
  }

  return (
    <SafeAreaView style={style.safeArea}>
      <ScrollView
        style={style.container}
        contentContainerStyle={style.contentContainer}
        alwaysBounceVertical={false}
      >
        <View style={style.content}>
          <Text style={style.header}>
            {t("onboarding.proximity_tracing_header")}
          </Text>
          <Text style={style.subheader}>
            {t("onboarding.proximity_tracing_subheader1")}
          </Text>
          <Text style={style.body}>
            {t("onboarding.proximity_tracing_body1")}
          </Text>
          <Text style={style.subheader}>
            {t("onboarding.proximity_tracing_subheader2")}
          </Text>
          <Text style={style.body}>
            {t("onboarding.proximity_tracing_body2")}
          </Text>
          <Text style={style.subheader}>
            {t("onboarding.proximity_tracing_subheader3")}
          </Text>
        </View>
        <TouchableOpacity
          onPress={handleOnPressActivateExposureNotifications}
          style={style.button}
        >
          <Text style={style.buttonText}>
            {t("onboarding.proximity_tracing_button")}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={handleOnPressDontEnable}
          style={style.secondaryButton}
        >
          <Text style={style.secondaryButtonText}>{t("common.no_thanks")}</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  )
}
const style = StyleSheet.create({
  safeArea: {
    backgroundColor: Colors.background.primaryLight,
  },
  container: {
    backgroundColor: Colors.background.primaryLight,
    height: "100%",
  },
  contentContainer: {
    paddingVertical: Spacing.large,
    paddingHorizontal: Spacing.medium,
  },
  content: {
    marginBottom: Spacing.medium,
  },
  header: {
    ...Typography.header.x60,
    marginBottom: Spacing.large,
  },
  subheader: {
    ...Typography.header.x20,
    marginBottom: Spacing.xSmall,
  },
  body: {
    ...Typography.body.x30,
    marginBottom: Spacing.xxLarge,
  },
  button: {
    ...Buttons.primary.base,
  },
  buttonText: {
    ...Typography.button.primary,
  },
  secondaryButton: {
    ...Buttons.secondary.base,
  },
  secondaryButtonText: {
    ...Typography.button.secondary,
  },
})

export default ActivateExposureNotifications
