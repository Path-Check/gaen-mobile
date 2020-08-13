import React, { FunctionComponent } from "react"
import { TouchableOpacity, Linking, View, StyleSheet } from "react-native"
import { useTranslation } from "react-i18next"
import { useNavigation } from "@react-navigation/native"

import { GlobalText } from "../../components/GlobalText"
import { Button } from "../../components/Button"

import { Screens } from "../../navigation"
import { Buttons, Colors, Typography, Spacing, Layout } from "../../styles"

const EnableExposureNotifications: FunctionComponent = () => {
  const { t } = useTranslation()
  const navigation = useNavigation()

  const handleOnPressOpenSettings = () => {
    Linking.openSettings()
  }

  const handleOnPressCancel = () => {
    navigation.navigate(Screens.Home)
  }

  return (
    <View
      style={style.container}
      testID={"affected-user-enable-exposure-notifications-screen"}
    >
      <View style={style.headerContainer}>
        <GlobalText style={style.header}>
          {t("export.enable_exposure_notifications_title")}
        </GlobalText>
        <GlobalText style={style.subheader}>
          {t("export.enable_exposure_notifications_body")}
        </GlobalText>
      </View>
      <View>
        <Button
          onPress={handleOnPressOpenSettings}
          label={t("common.settings")}
        />
        <TouchableOpacity
          onPress={handleOnPressCancel}
          style={style.secondaryButton}
          accessibilityLabel={t("export.code_input_button_cancel")}
        >
          <GlobalText style={style.secondaryButtonText}>
            {t("export.code_input_button_cancel")}
          </GlobalText>
        </TouchableOpacity>
      </View>
    </View>
  )
}

const style = StyleSheet.create({
  container: {
    backgroundColor: Colors.primaryBackground,
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
  secondaryButton: {
    ...Buttons.secondary,
  },
  secondaryButtonText: {
    ...Typography.buttonSecondaryText,
  },
})

export default EnableExposureNotifications
