import React, { FunctionComponent } from "react"
import {
  Platform,
  Alert,
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
import { useApplicationName } from "../More/useApplicationInfo"
import { ActivationScreens } from "../navigation"
import { GlobalText } from "../components"
import { Button } from "../components"

import { Spacing, Typography, Buttons, Colors } from "../styles"

const ActivateProximityTracing: FunctionComponent = () => {
  const { t } = useTranslation()
  const navigation = useNavigation()
  const { applicationName } = useApplicationName()
  const { completeOnboarding } = useOnboardingContext()
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
      completeOnboarding()
    }
  }

  const handleOnPressActivateProximityTracing = () => {
    Alert.alert(
      t("onboarding.proximity_tracing_alert_header", { applicationName }),
      t("onboarding.proximity_tracing_alert_body", { applicationName }),
      [
        {
          text: t("common.cancel"),
          style: "cancel",
        },
        {
          text: t("common.enable"),
          onPress: handleOnPressEnable,
        },
      ],
    )
  }

  return (
    <SafeAreaView style={style.safeArea}>
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
        <View style={style.buttonsContainer}>
          <Button
            onPress={handleOnPressActivateProximityTracing}
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
      </ScrollView>
    </SafeAreaView>
  )
}
const style = StyleSheet.create({
  safeArea: {
    backgroundColor: Colors.primaryLightBackground,
  },
  container: {
    backgroundColor: Colors.primaryLightBackground,
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
    ...Typography.header1,
    marginBottom: Spacing.large,
  },
  subheader: {
    ...Typography.header5,
    marginBottom: Spacing.xSmall,
  },
  body: {
    ...Typography.body1,
    marginBottom: Spacing.xxLarge,
  },
  buttonsContainer: {
    alignSelf: "flex-start",
  },
  secondaryButton: {
    ...Buttons.secondary,
  },
  secondaryButtonText: {
    ...Typography.buttonSecondary,
  },
})

export default ActivateProximityTracing
