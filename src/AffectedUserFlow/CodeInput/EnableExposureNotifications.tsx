import React, { FunctionComponent } from "react"
import { TouchableOpacity, Linking, View, StyleSheet } from "react-native"
import { useTranslation } from "react-i18next"
import { useNavigation } from "@react-navigation/native"

import { RTLEnabledText } from "../../components/RTLEnabledText"

import { Stacks } from "../../navigation"
import { Buttons, Colors, Typography, Spacing, Layout } from "../../styles"

const EnableExposureNotifications: FunctionComponent = () => {
  const { t } = useTranslation()
  const navigation = useNavigation()

  const handleOnPressOpenSettings = () => {
    Linking.openSettings()
  }

  const handleOnPressCancel = () => {
    navigation.navigate(Stacks.More)
  }

  return (
    <View
      style={style.container}
      testID={"affected-user-enable-exposure-notifications-screen"}
    >
      <View style={style.headerContainer}>
        <RTLEnabledText style={style.header}>
          {t("export.enable_exposure_notifications_title")}
        </RTLEnabledText>

        <RTLEnabledText style={style.subheader}>
          {t("export.enable_exposure_notifications_body")}
        </RTLEnabledText>
      </View>
      <View>
        <TouchableOpacity
          onPress={handleOnPressOpenSettings}
          accessible
          accessibilityLabel={t("common.settings")}
          accessibilityRole="button"
          style={style.button}
        >
          <RTLEnabledText style={style.buttonText}>
            {t("common.settings")}
          </RTLEnabledText>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={handleOnPressCancel}
          style={style.secondaryButton}
        >
          <RTLEnabledText style={style.secondaryButtonText}>
            {t("export.code_input_button_cancel")}
          </RTLEnabledText>
        </TouchableOpacity>
      </View>
    </View>
  )
}

const style = StyleSheet.create({
  container: {
    backgroundColor: Colors.primaryBackgroundFaintShade,
    height: "100%",
    justifyContent: "space-between",
    paddingHorizontal: Spacing.medium,
    paddingTop: Layout.oneTenthHeight,
    paddingBottom: Spacing.small,
  },
  headerContainer: {
    marginBottom: Spacing.xxxHuge,
  },
  header: {
    ...Typography.header2,
    marginBottom: Spacing.xxSmall,
  },
  subheader: {
    ...Typography.header4,
    color: Colors.secondaryText,
  },
  button: {
    ...Buttons.primary,
  },
  buttonText: {
    ...Typography.buttonTextPrimary,
  },
  secondaryButton: {
    ...Buttons.secondary,
  },
  secondaryButtonText: {
    ...Typography.buttonTextSecondary,
  },
})

export default EnableExposureNotifications
