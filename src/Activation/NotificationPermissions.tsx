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
import { usePermissionsContext } from "../PermissionsContext"
import { GlobalText, Button } from "../components"

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
    navigation.navigate(ActivationStackScreens.ActivationSummary)
  }

  const handleOnPressMaybeLater = () => {
    navigation.navigate(ActivationStackScreens.ActivationSummary)
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

export default NotificationsPermissions
