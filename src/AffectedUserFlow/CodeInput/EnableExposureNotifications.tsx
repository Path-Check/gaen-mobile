import React, { FunctionComponent } from "react"
import { ScrollView, View, StyleSheet } from "react-native"
import { useTranslation } from "react-i18next"

import { Text, Button, StatusBar } from "../../components"
import { useStatusBarEffect } from "../../navigation"
import { Spacing, Colors, Typography } from "../../styles"
import { openAppSettings } from "../../gaen/nativeModule"

const EnableExposureNotifications: FunctionComponent = () => {
  useStatusBarEffect("dark-content", Colors.primaryLightBackground)
  const { t } = useTranslation()

  const handleOnPressOpenSettings = () => {
    openAppSettings()
  }

  return (
    <>
      <StatusBar backgroundColor={Colors.primaryLightBackground} />
      <ScrollView
        contentContainerStyle={style.contentContainer}
        testID={"affected-user-enable-exposure-notifications-screen"}
        alwaysBounceVertical={false}
      >
        <View style={style.headerContainer}>
          <Text style={style.header}>
            {t("export.enable_exposure_notifications_title")}
          </Text>
          <Text style={style.subheader}>
            {t("export.enable_exposure_notifications_body")}
          </Text>
        </View>
        <View style={style.buttonContainer}>
          <Button
            onPress={handleOnPressOpenSettings}
            label={t("common.settings")}
          />
        </View>
      </ScrollView>
    </>
  )
}

const style = StyleSheet.create({
  contentContainer: {
    flexGrow: 1,
    justifyContent: "space-between",
    paddingHorizontal: Spacing.large,
    paddingBottom: Spacing.massive,
    backgroundColor: Colors.primaryLightBackground,
  },
  headerContainer: {
    marginBottom: Spacing.huge,
  },
  header: {
    ...Typography.header1,
    marginBottom: Spacing.small,
  },
  subheader: {
    ...Typography.body2,
  },
  buttonContainer: {
    alignSelf: "flex-start",
  },
})

export default EnableExposureNotifications
