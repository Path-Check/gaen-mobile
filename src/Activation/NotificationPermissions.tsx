import React, { FunctionComponent } from "react"
import {
  ScrollView,
  SafeAreaView,
  View,
  StyleSheet,
  TouchableOpacity,
} from "react-native"
import { useTranslation } from "react-i18next"

import { usePermissionsContext } from "../PermissionsContext"
import { useOnboardingContext } from "../OnboardingContext"
import { GlobalText } from "../components"
import { Button } from "../components"

import { Colors, Spacing, Typography, Buttons } from "../styles"

const NotificationsPermissions: FunctionComponent = () => {
  const { t } = useTranslation()
  const { notification } = usePermissionsContext()
  const { setOnboardingToComplete } = useOnboardingContext()

  const requestPermission = async () => {
    await notification.request()
  }

  const handleOnPressEnable = async () => {
    await requestPermission()
    setOnboardingToComplete()
  }

  const handleOnPressMaybeLater = () => {
    setOnboardingToComplete()
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
            {t("onboarding.notification_header")}
          </GlobalText>
          <GlobalText style={style.subheader}>
            {t("onboarding.notification_subheader1")}
          </GlobalText>
          <GlobalText style={style.body}>
            {t("onboarding.notification_body1")}
          </GlobalText>
          <GlobalText style={style.subheader}>
            {t("onboarding.notification_subheader2")}
          </GlobalText>
          <GlobalText style={style.body}>
            {t("onboarding.notification_body2")}
          </GlobalText>
          <GlobalText style={style.subheader}>
            {t("onboarding.notification_subheader3")}
          </GlobalText>
        </View>
        <View style={style.buttonsContainer}>
          <Button
            onPress={handleOnPressEnable}
            label={t("label.launch_enable_notif")}
          />
          <TouchableOpacity
            onPress={handleOnPressMaybeLater}
            style={style.secondaryButton}
          >
            <GlobalText style={style.secondaryButtonText}>
              {t("common.maybe_later")}
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
  buttonsContainer: {
    alignSelf: "flex-start",
  },
  secondaryButton: {
    ...Buttons.secondary,
  },
  secondaryButtonText: {
    ...Typography.buttonSecondaryText,
  },
})

export default NotificationsPermissions
