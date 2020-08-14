import React, { FunctionComponent } from "react"
import { TouchableNativeFeedback, StyleSheet, View, Image } from "react-native"
import { useTranslation } from "react-i18next"
import { useNavigation } from "@react-navigation/native"

import { GlobalText } from "../components/GlobalText"
import { Button } from "../components/Button"
import { useStatusBarEffect } from "../navigation"

import { Screens } from "../navigation"

import { Spacing, Colors, Typography, Outlines, Layout } from "../styles"
import { Images } from "../assets"

export const ExportIntro: FunctionComponent = () => {
  const { t } = useTranslation()
  const navigation = useNavigation()

  useStatusBarEffect("dark-content")

  const handleOnPressNext = () => {
    navigation.navigate(Screens.AffectedUserCodeInput)
  }

  const handleOnPressCancel = () => {
    navigation.navigate(Screens.Home)
  }

  return (
    <View style={style.container}>
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
      <Image
        source={Images.PersonAndHealthExpert}
        style={style.image}
        accessible
        accessibilityLabel={t("exoprt.start_image_label")}
      />
      <GlobalText style={style.header}>
        {t("export.start_header_bluetooth")}
      </GlobalText>
      <View style={style.buttonContainer}>
        <Button
          label={t("common.start")}
          onPress={handleOnPressNext}
          hasRightArrow
        />
      </View>
    </View>
  )
}

const style = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: Spacing.large,
    paddingTop: Spacing.huge,
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
  image: {
    width: "100%",
    height: 300,
    marginBottom: Spacing.small,
    resizeMode: "contain",
  },
  header: {
    ...Typography.header1,
    marginBottom: Spacing.xLarge,
  },
  buttonContainer: {
    alignSelf: "flex-start",
  },
})

export default ExportIntro
