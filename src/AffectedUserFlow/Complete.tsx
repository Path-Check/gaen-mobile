import React, { FunctionComponent } from "react"
import { Image, StyleSheet, View } from "react-native"
import { useNavigation } from "@react-navigation/native"
import { useTranslation } from "react-i18next"

import { useStatusBarEffect } from "../navigation"
import { GlobalText } from "../components/GlobalText"
import { Button } from "../components/Button"
import { Screens } from "../navigation"

import { Images } from "../assets"
import { Layout, Spacing, Typography } from "../styles"

export const ExportComplete: FunctionComponent = () => {
  useStatusBarEffect("dark-content")
  const { t } = useTranslation()
  const navigation = useNavigation()

  const handleOnPressDone = () => {
    navigation.navigate(Screens.Home)
  }

  return (
    <View style={style.container}>
      <Image source={Images.CheckInCircle} style={style.image} />
      <GlobalText style={style.header}>{t("export.complete_title")}</GlobalText>
      <GlobalText style={style.contentText}>
        {t("export.complete_body_bluetooth")}
      </GlobalText>
      <Button onPress={handleOnPressDone} label={t("common.done")} />
    </View>
  )
}

const style = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingTop: Layout.oneTwentiethHeight,
    paddingBottom: Spacing.xxHuge,
    paddingHorizontal: Spacing.large,
  },
  image: {
    width: 230,
    height: 150,
    marginBottom: Spacing.medium,
    resizeMode: "cover",
  },
  header: {
    ...Typography.header2,
    textAlign: "center",
    marginBottom: Spacing.medium,
  },
  contentText: {
    ...Typography.secondaryContent,
    textAlign: "center",
    marginBottom: Spacing.xxxLarge,
  },
})

export default ExportComplete
