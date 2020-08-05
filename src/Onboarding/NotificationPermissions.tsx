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
import { Screens } from "../navigation"
import { GlobalText } from "../components"
import { Button } from "../components"

import { Colors, Spacing, Typography, Buttons } from "../styles"

const NotificationsPermissions: FunctionComponent = () => {
  const navigation = useNavigation()
  const { t } = useTranslation()
  const { notification } = usePermissionsContext()

  const requestPermission = async () => {
    await notification.request()
  }

  const continueOnboarding = () => {
    navigation.navigate(Screens.EnableExposureNotifications)
  }

  const handleOnPressEnable = async () => {
    await requestPermission()
    continueOnboarding()
  }

  const handleOnPressMaybeLater = () => {
    continueOnboarding()
  }

  return (
    <SafeAreaView>
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

export default NotificationsPermissions

