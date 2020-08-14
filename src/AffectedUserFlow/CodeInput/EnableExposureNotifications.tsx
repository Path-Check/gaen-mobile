import React, { FunctionComponent } from "react"
import {
  TouchableNativeFeedback,
  Linking,
  View,
  StyleSheet,
} from "react-native"
import { useTranslation } from "react-i18next"
import { useNavigation } from "@react-navigation/native"
import { SvgXml } from "react-native-svg"

import { GlobalText } from "../../components/GlobalText"
import { Button } from "../../components/Button"

import { Screens } from "../../navigation"
import { Iconography, Colors, Typography, Spacing, Layout } from "../../styles"
import { Icons } from "../../assets"

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
      <View style={style.cancelButtonContainer}>
        <TouchableNativeFeedback
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
        </TouchableNativeFeedback>
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
    </View>
  )
}

const style = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between",
    paddingHorizontal: Spacing.large,
    paddingTop: Layout.oneEighthHeight,
    paddingBottom: 70,
    backgroundColor: Colors.primaryBackground,
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
    ...Typography.secondaryContent,
  },
  buttonContainer: {
    alignSelf: "flex-start",
  },
})

export default EnableExposureNotifications
