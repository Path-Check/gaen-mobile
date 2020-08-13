import React, { FunctionComponent } from "react"
import {
  Platform,
  ScrollView,
  SafeAreaView,
  View,
  StyleSheet,
  TouchableOpacity,
} from "react-native"
import { useTranslation } from "react-i18next"
import { useNavigation } from "@react-navigation/native"

import { usePermissionsContext } from "../PermissionsContext"
import { useOnboardingContext } from "../OnboardingContext"
import { ActivationScreens } from "../navigation"
import { GlobalText } from "../components"
import { Button } from "../components"

import { Spacing, Typography, Buttons, Colors } from "../styles"

const ActivateProximityTracing: FunctionComponent = () => {
  const { t } = useTranslation()
  const navigation = useNavigation()

  const { setOnboardingToComplete } = useOnboardingContext()
  const { exposureNotifications } = usePermissionsContext()

  const handleOnPressEnable = () => {
    exposureNotifications.request()
    navigateToNextScreen()
  }

  const handleOnPressDontEnable = () => {
    navigateToNextScreen()
  }

  const navigateToNextScreen = () => {
    if (Platform.OS === "ios") {
      navigation.navigate(ActivationScreens.NotificationPermissions)
    } else {
      setOnboardingToComplete()
    }
  }

  return (
    <SafeAreaView style={{ backgroundColor: Colors.primaryBackground }}>
      <ScrollView
        style={style.container}
        contentContainerStyle={style.contentContainer}
        alwaysBounceVertical={false}
      >
        <View style={style.content}>
          <GlobalText style={style.header}>
            {t("onboarding.proximity_tracing_header")}
          </GlobalText>
          <GlobalText style={style.subheader}>
            {t("onboarding.proximity_tracing_subheader1")}
          </GlobalText>
          <GlobalText style={style.body}>
            {t("onboarding.proximity_tracing_body1")}
          </GlobalText>
          <GlobalText style={style.subheader}>
            {t("onboarding.proximity_tracing_subheader2")}
          </GlobalText>
          <GlobalText style={style.body}>
            {t("onboarding.proximity_tracing_body2")}
          </GlobalText>
          <GlobalText style={style.subheader}>
            {t("onboarding.proximity_tracing_subheader3")}
          </GlobalText>
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
    backgroundColor: Colors.primaryBackground,
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
    ...Typography.header2,
    marginBottom: Spacing.large,
  },
  subheader: {
    ...Typography.header4,
    marginBottom: Spacing.xSmall,
  },
  body: {
    ...Typography.mainContent,
    marginBottom: Spacing.xxLarge,
  },
  secondaryButton: {
    ...Buttons.secondary,
  },
  secondaryButtonText: {
    ...Typography.buttonSecondaryText,
  },
})

export default ActivateProximityTracing
