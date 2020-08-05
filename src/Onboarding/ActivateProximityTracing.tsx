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

import { usePermissionsContext } from "../PermissionsContext"
import { OnboardingScreens } from "../navigation"
import { GlobalText } from "../components"
import { Button } from "../components"

import { Spacing, Typography, Buttons, Colors } from "../styles"

const ActivateProximityTracing: FunctionComponent = () => {
  const { t } = useTranslation()
  const navigation = useNavigation()

  const { exposureNotifications } = usePermissionsContext()

  const headerText = t("onboarding.proximity_tracing_header")
  const subheader1Text = t("onboarding.proximity_tracing_subheader1")
  const subheader2Text = t("onboarding.proximity_tracing_subheader2")
  const subheader3Text = t("onboarding.proximity_tracing_subheader3")
  const body1Text = t("onboarding.proximity_tracing_body1")
  const body2Text = t("onboarding.proximity_tracing_body2")

  const handleOnPressEnable = () => {
    exposureNotifications.request()
    navigation.navigate(OnboardingScreens.NotificationPermissions)
  }

  const handleOnPressDontEnable = () => {
    navigation.navigate(OnboardingScreens.NotificationPermissions)
  }

  return (
    <SafeAreaView>
      <ScrollView
        style={style.container}
        contentContainerStyle={style.contentContainer}
        alwaysBounceVertical={false}
      >
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
      </ScrollView>
    </SafeAreaView>
  )
}
const style = StyleSheet.create({
  container: {
    backgroundColor: Colors.white,
  },
  contentContainer: {
    paddingVertical: Spacing.xxLarge,
    paddingHorizontal: Spacing.medium,
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

export default ActivateProximityTracing
