import React, { FunctionComponent } from "react"
import {
  TouchableNativeFeedback,
  Linking,
  View,
  StyleSheet,
} from "react-native"
import { useTranslation } from "react-i18next"
import { useNavigation } from "@react-navigation/native"

import { GlobalText } from "../../components/GlobalText"
import { Button } from "../../components/Button"

import { Screens } from "../../navigation"
import { Outlines, Colors, Typography, Spacing, Layout } from "../../styles"

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
      <TouchableNativeFeedback
        onPress={handleOnPressCancel}
        style={style.cancelButtonContainer}
        accessible
        accessibilityLabel={t("export.code_input_button_cancel")}
      >
        <View style={style.cancelButtonContainer}>
          <GlobalText style={style.cancelButtonText}>
            {t("common.cancel")}
          </GlobalText>
        </View>
      </TouchableNativeFeedback>
      <View style={style.headerContainer}>
        <GlobalText style={style.header}>
          {t("export.enable_exposure_notifications_title")}
        </GlobalText>
        <GlobalText style={style.subheader}>
          {t("export.enable_exposure_notifications_body")}
        </GlobalText>
      </View>
      <View style={style.buttonContainer}>
        <Button
          onPress={handleOnPressOpenSettings}
          label={t("common.settings")}
        />
      </View>
    </View>
  )
}

const style = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: Spacing.large,
    paddingTop: Layout.oneTenthHeight,
    backgroundColor: Colors.primaryBackground,
  },
  cancelButtonContainer: {
    position: "absolute",
    top: Spacing.xxLarge,
    right: Spacing.xxSmall,
    zIndex: Layout.zLevel1,
    padding: Spacing.medium,
    borderRadius: Outlines.borderRadiusMax,
  },
  cancelButtonText: {
    ...Typography.secondaryContent,
  },
  headerContainer: {
    marginBottom: Spacing.huge,
  },
  header: {
    ...Typography.header2,
    marginBottom: Spacing.xxSmall,
  },
  subheader: {
    ...Typography.secondaryContent,
  },
  buttonContainer: {
    alignSelf: "flex-start",
  },
})

export default EnableExposureNotifications
