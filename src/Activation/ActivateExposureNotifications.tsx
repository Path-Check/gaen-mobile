import React, { FunctionComponent, useRef } from "react"
import {
  ScrollView,
  SafeAreaView,
  View,
  StyleSheet,
  TouchableOpacity,
} from "react-native"
import { SvgXml } from "react-native-svg"
import { useTranslation } from "react-i18next"

import { usePermissionsContext } from "../Device/PermissionsContext"
import { useProductAnalyticsContext } from "../ProductAnalytics/Context"
import { Text } from "../components"
import { useActivationNavigation } from "./useActivationNavigation"
import { useRequestExposureNotifications } from "../useRequestExposureNotifications"

import { Icons } from "../assets"
import { Spacing, Typography, Buttons, Colors, Iconography } from "../styles"

const ActivateExposureNotifications: FunctionComponent = () => {
  const { t } = useTranslation()
  const scrollRef = useRef<ScrollView>(null)
  const { exposureNotifications } = usePermissionsContext()

  const isENActive = exposureNotifications.status === "Active"

  setTimeout(() => {
    if (scrollRef.current !== null)
      scrollRef.current.scrollToEnd({ animated: true })
  }, 300)

  return (
    <SafeAreaView style={style.safeArea}>
      <ScrollView
        style={style.container}
        contentContainerStyle={style.contentContainer}
        alwaysBounceVertical={false}
        ref={scrollRef}
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
  const { goToNextScreenFrom } = useActivationNavigation()
  const requestExposureNotifications = useRequestExposureNotifications()

  const handleOnPressDontEnable = () => {
    trackEvent("product_analytics", "onboarding_en_permissions_denied")
    goToNextScreenFrom("ActivateExposureNotifications")
  }

  const handleOnPressEnable = () => {
    trackEvent("product_analytics", "onboarding_en_permissions_accept")
    requestExposureNotifications()
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
        accessibilityRole="button"
        accessibilityLabel={t(
          "accessibility.hint.navigates_to_next_screen_without_enabling",
        )}
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
      <TouchableOpacity
        accessibilityLabel={t("common.continue")}
        accessibilityHint={t("accessibility.hint.navigates_to_new_screen")}
        accessibilityRole="button"
        onPress={handleOnPressContinue}
        style={style.button}
      >
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
