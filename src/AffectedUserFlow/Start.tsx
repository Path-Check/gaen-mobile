import React, { FunctionComponent } from "react"
import {
  StyleSheet,
  TouchableOpacity,
  View,
  Image,
  ScrollView,
} from "react-native"
import { useTranslation } from "react-i18next"
import { useNavigation } from "@react-navigation/native"
import { SvgXml } from "react-native-svg"

import { StatusBar, GlobalText, Button } from "../components"
import { Screens, useStatusBarEffect } from "../navigation"

import { Layout, Spacing, Colors, Iconography, Typography } from "../styles"
import { Images, Icons } from "../assets"

export const ExportIntro: FunctionComponent = () => {
  useStatusBarEffect("dark-content", Colors.primaryLightBackground)
  const { t } = useTranslation()
  const navigation = useNavigation()

  const handleOnPressNext = () => {
    navigation.navigate(Screens.AffectedUserCodeInput)
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
        alwaysBounceVertical={false}
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
      </ScrollView>
    </>
  )
}

const style = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: Spacing.large,
    paddingTop: Spacing.huge,
    backgroundColor: Colors.primaryLightBackground,
  },
  contentContainer: {
    paddingBottom: 80,
  },
  cancelButtonContainer: {
    position: "absolute",
    top: Spacing.xxxSmall,
    right: Spacing.xxxSmall,
    zIndex: Layout.zLevel1,
  },
  cancelButtonInnerContainer: {
    padding: Spacing.medium,
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
