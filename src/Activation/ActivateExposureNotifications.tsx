import React, { FunctionComponent, useCallback } from "react"
import {
  ScrollView,
  SafeAreaView,
  View,
  StyleSheet,
  TouchableOpacity,
  Platform,
  Alert,
} from "react-native"
import { useTranslation } from "react-i18next"
import { useFocusEffect, useNavigation } from "@react-navigation/native"

import { usePermissionsContext } from "../Device/PermissionsContext"
import { openAppSettings } from "../Device"
import { useApplicationName } from "../Device/useApplicationInfo"
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
  const { applicationName } = useApplicationName()
  const { trackEvent } = useProductAnalyticsContext()

  const isLocationRequiredAndOff = locationPermissions === "RequiredOff"

  const navigateToNextScreen = useCallback(() => {
    navigation.navigate(
      nextScreenFromExposureNotifications({
        isLocationRequiredAndOff,
        isBluetoothOn,
      }),
    )
  }, [isBluetoothOn, isLocationRequiredAndOff, navigation])

  useFocusEffect(
    useCallback(() => {
      if (exposureNotifications.status === "Enabled") {
        navigateToNextScreen()
      }
    }, [exposureNotifications.status, navigateToNextScreen]),
  )

  const showNotAuthorizedAlert = () => {
    const errorMessage = Platform.select({
      ios: t("home.proximity_tracing.unauthorized_error_message_ios", {
        applicationName,
      }),
      android: t("home.proximity_tracing.unauthorized_error_message_android", {
        applicationName,
      }),
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

  const handleOnPressEnable = async () => {
    try {
      const response = await exposureNotifications.request()
      if (response.kind === "success") {
        if (response.status !== "Enabled") {
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
        <TouchableOpacity onPress={handleOnPressEnable} style={style.button}>
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
