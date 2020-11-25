import React, { FunctionComponent } from "react"
import {
  ScrollView,
  SafeAreaView,
  View,
  StyleSheet,
  TouchableOpacity,
  Platform,
  Alert,
} from "react-native"
import { SvgXml } from "react-native-svg"
import { useTranslation } from "react-i18next"

import { usePermissionsContext } from "../Device/PermissionsContext"
import { openAppSettings } from "../Device"
import { useApplicationName } from "../Device/useApplicationInfo"
import { useProductAnalyticsContext } from "../ProductAnalytics/Context"
import { Text } from "../components"
import { useActivationNavigation } from "./useActivationNavigation"

import { Icons } from "../assets"
import { Spacing, Typography, Buttons, Colors, Iconography } from "../styles"

const ActivateExposureNotifications: FunctionComponent = () => {
  const { t } = useTranslation()
  const { exposureNotifications } = usePermissionsContext()

  const isENActive = exposureNotifications.status === "Active"

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
        {!isENActive ? <EnableENButtons /> : <ENAlreadyEnabledButtons />}
      </ScrollView>
    </SafeAreaView>
  )
}

const EnableENButtons: FunctionComponent = () => {
  const { t } = useTranslation()
  const { trackEvent } = useProductAnalyticsContext()
  const { exposureNotifications } = usePermissionsContext()
  const { goToNextScreenFrom } = useActivationNavigation()
  const { applicationName } = useApplicationName()

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

  const handleOnPressEnable = async () => {
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

  const handleOnPressDontEnable = () => {
    trackEvent("product_analytics", "onboarding_en_permissions_denied")
    goToNextScreenFrom("ActivateExposureNotifications")
  }

  return (
    <View>
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
    </View>
  )
}

const ENAlreadyEnabledButtons: FunctionComponent = () => {
  const { t } = useTranslation()
  const { goToNextScreenFrom } = useActivationNavigation()

  const handleOnPressContinue = () => {
    goToNextScreenFrom("ActivateExposureNotifications")
  }

  return (
    <View style={style.alreadyActiveContainer}>
      <View style={style.alreadyActiveInfoContainer}>
        <View style={style.alreadyActiveIconContainer}>
          <SvgXml
            xml={Icons.CheckInCircle}
            fill={Colors.accent.success100}
            width={Iconography.xSmall}
            height={Iconography.xSmall}
          />
        </View>
        <View style={style.alreadyActiveTextContainer}>
          <Text style={style.alreadyActiveText}>
            {t("onboarding.proximity_tracing_already_active")}
          </Text>
        </View>
      </View>
      <TouchableOpacity onPress={handleOnPressContinue} style={style.button}>
        <Text style={style.buttonText}>{t("common.continue")}</Text>
      </TouchableOpacity>
    </View>
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
  alreadyActiveContainer: {
    borderTopWidth: 1,
    borderTopColor: Colors.neutral.shade50,
  },
  alreadyActiveInfoContainer: {
    flexDirection: "row",
    paddingVertical: Spacing.large,
  },
  alreadyActiveIconContainer: {
    flex: 1,
    justifyContent: "center",
  },
  alreadyActiveTextContainer: {
    flex: 8,
    justifyContent: "center",
  },
  alreadyActiveText: {
    ...Typography.body.x30,
  },
})

export default ActivateExposureNotifications
