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

import { ActivationStackScreens } from "../navigation"
import { usePermissionsContext } from "../Device/PermissionsContext"
import { Text } from "../components"

import { Colors, Spacing, Typography, Buttons } from "../styles"

const NotificationsPermissions: FunctionComponent = () => {
  const { t } = useTranslation()
  const { notification } = usePermissionsContext()
  const navigation = useNavigation()

  const handleOnPressEnable = async () => {
    await new Promise((resolve) => {
      notification.request()
      resolve()
    })
    navigation.navigate(ActivationStackScreens.AnonymizedDataConsent)
  }

  const handleOnPressMaybeLater = () => {
    navigation.navigate(ActivationStackScreens.AnonymizedDataConsent)
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
            {t("onboarding.notification_header")}
          </Text>
          <Text style={style.subheader}>
            {t("onboarding.notification_subheader1")}
          </Text>
          <Text style={style.body}>{t("onboarding.notification_body1")}</Text>
          <Text style={style.subheader}>
            {t("onboarding.notification_subheader2")}
          </Text>
          <Text style={style.body}>{t("onboarding.notification_body2")}</Text>
          <Text style={style.subheader}>
            {t("onboarding.notification_subheader3")}
          </Text>
        </View>
        <TouchableOpacity
          onPress={handleOnPressEnable}
          style={style.button}
          accessibilityLabel={t("label.launch_enable_notif")}
        >
          <Text style={style.buttonText}>{t("label.launch_enable_notif")}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={handleOnPressMaybeLater}
          style={style.secondaryButton}
        >
          <Text style={style.secondaryButtonText}>
            {t("common.maybe_later")}
          </Text>
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

export default NotificationsPermissions
