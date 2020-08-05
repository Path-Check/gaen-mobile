import React, { FunctionComponent } from "react"
import { SafeAreaView, View, StyleSheet, TouchableOpacity } from "react-native"
import { useTranslation } from "react-i18next"

import { usePermissionsContext } from "../PermissionsContext"
import { useOnboardingContext } from "../OnboardingContext"
import { GlobalText } from "../components"
import { Button } from "../components"

import { Spacing, Typography, Buttons } from "../styles"

const EnableExposureNotifications = (): JSX.Element => {
  const { t } = useTranslation()
  const { exposureNotifications } = usePermissionsContext()
  const { setOnboardingToComplete } = useOnboardingContext()

  const headerText = t("onboarding.proximity_tracing_header")
  const subheader1Text = t("onboarding.proximity_tracing_subheader1")
  const subheader2Text = t("onboarding.proximity_tracing_subheader2")
  const subheader3Text = t("onboarding.proximity_tracing_subheader3")
  const body1Text = t("onboarding.proximity_tracing_body1")
  const body2Text = t("onboarding.proximity_tracing_body2")
  const buttonLabel = t("onboarding.enable_proximity_tracing")
  const disableButtonLabel = t("onboarding.dont_enable_proximity_tracing")

  const handleOnPressEnable = () => {
    exposureNotifications.request()
    setOnboardingToComplete()
  }

  const handleOnPressDontEnable = () => {
    setOnboardingToComplete()
  }

  return (
    <SafeAreaView>
      <View style={style.container}>
        <View style={style.content}>
          <GlobalText style={style.header}>{headerText}</GlobalText>
          <GlobalText style={style.subheader}>{subheader1Text}</GlobalText>
          <GlobalText style={style.body}>{body1Text}</GlobalText>
          <GlobalText style={style.subheader}>{subheader2Text}</GlobalText>
          <GlobalText style={style.body}>{body2Text}</GlobalText>
          <GlobalText style={style.subheader}>{subheader3Text}</GlobalText>
        </View>
        <Button
          onPress={handleOnPressEnable}
          label={t("onboarding.proximity_tracing_button")}
        />
        <TouchableOpacity
          onPress={handleOnPressDontEnable}
          style={style.secondaryButton}
        >
          <GlobalText style={style.secondaryButtonText}>
            {t("common.no_thanks")}
          </GlobalText>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  )
}
const style = StyleSheet.create({
  container: {
    padding: Spacing.medium,
  },
  content: {
    marginBottom: Spacing.medium,
  },
  header: {
    ...Typography.header2,
    marginBottom: Spacing.small,
  },
  subheader: {
    ...Typography.header4,
    marginBottom: Spacing.xSmall,
  },
  body: {
    ...Typography.mainContent,
    marginBottom: Spacing.medium,
  },
  secondaryButton: {
    ...Buttons.secondary,
  },
  secondaryButtonText: {
    ...Typography.buttonSecondaryText,
  },
})

export default EnableExposureNotifications

