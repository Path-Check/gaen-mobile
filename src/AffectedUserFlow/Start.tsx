import React from "react"
import { StyleSheet, View, Image } from "react-native"
import { useTranslation } from "react-i18next"
import { useNavigation } from "@react-navigation/native"

import { GlobalText } from "../components/GlobalText"
import { Button } from "../components/Button"
import { useStatusBarEffect } from "../navigation"

import { Screens } from "../navigation"

import { Outlines, Iconography, Spacing, Colors, Typography } from "../styles"
import { Images } from "../assets"

export const ExportIntro = (): JSX.Element => {
  const { t } = useTranslation()
  const navigation = useNavigation()

  useStatusBarEffect("dark-content")

  const handleOnPressNext = () => {
    navigation.navigate(Screens.AffectedUserCodeInput)
  }

  return (
    <View style={style.container}>
      <View style={style.cancelButtonContainer}>
        <GlobalText style={style.cancelButtonText}>
          {t("common.cancel")}
        </GlobalText>
      </View>
      <Image source={Images.PersonAndHealthExpert} style={style.image} />
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
    top: Spacing.xxxHuge,
    right: Spacing.medium,
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
