import React, { FunctionComponent } from "react"
import {
  ScrollView,
  TouchableOpacity,
  Linking,
  View,
  StyleSheet,
} from "react-native"
import { useTranslation } from "react-i18next"
import { useNavigation } from "@react-navigation/native"
import { SvgXml } from "react-native-svg"

import { GlobalText, Button, StatusBar } from "../../components"
import { Screens, useStatusBarEffect } from "../../navigation"
import { Iconography, Colors, Typography, Spacing, Layout } from "../../styles"
import { Icons } from "../../assets"

const EnableExposureNotifications: FunctionComponent = () => {
  useStatusBarEffect("dark-content", Colors.primaryLightBackground)
  const { t } = useTranslation()
  const navigation = useNavigation()

  const handleOnPressOpenSettings = () => {
    Linking.openSettings()
  }

  const handleOnPressCancel = () => {
    navigation.navigate(Screens.Home)
  }

  return (
    <>
      <StatusBar backgroundColor={Colors.primaryLightBackground} />
      <ScrollView
        style={style.container}
        contentContainerStyle={style.contentContainer}
        testID={"affected-user-enable-exposure-notifications-screen"}
      >
        <View style={style.cancelButtonContainer}>
          <TouchableOpacity
            onPress={handleOnPressCancel}
            accessible
            accessibilityLabel={t("export.code_input_button_cancel")}
          >
            <View style={style.cancelButtonInnerContainer}>
              <SvgXml
                xml={Icons.X}
                fill={Colors.black}
                width={Iconography.xSmall}
                height={Iconography.xSmall}
              />
            </View>
          </TouchableOpacity>
        </View>
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
      </ScrollView>
    </>
  )
}

const style = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    justifyContent: "space-between",
    paddingHorizontal: Spacing.large,
    paddingTop: Layout.oneEighthHeight,
    paddingBottom: Spacing.xxxHuge,
    backgroundColor: Colors.primaryLightBackground,
  },
  cancelButtonContainer: {
    position: "absolute",
    top: Layout.oneTwentiethHeight,
    right: Spacing.xxSmall,
  },
  cancelButtonInnerContainer: {
    padding: Spacing.medium,
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
