import React, { FunctionComponent } from "react"
import { ScrollView, Image, StyleSheet } from "react-native"
import { useNavigation } from "@react-navigation/native"
import { useTranslation } from "react-i18next"

import { StatusBar, Text, Button } from "../components"
import { useStatusBarEffect, Stacks } from "../navigation"

import { Images } from "../assets"
import { Colors, Layout, Spacing, Typography } from "../styles"

export const AffectedUserComplete: FunctionComponent = () => {
  useStatusBarEffect("dark-content", Colors.primaryLightBackground)
  const { t } = useTranslation()
  const navigation = useNavigation()

  const handleOnPressDone = () => {
    navigation.navigate(Stacks.Home)
  }

  return (
    <>
      <StatusBar backgroundColor={Colors.primaryLightBackground} />
      <ScrollView
        style={style.container}
        contentContainerStyle={style.contentContainer}
        alwaysBounceVertical={false}
      >
        <Image source={Images.CheckInCircle} style={style.image} />
        <Text style={style.header}>{t("export.complete_title")}</Text>
        <Text style={style.contentText}>
          {t("export.complete_body_bluetooth")}
        </Text>
        <Button onPress={handleOnPressDone} label={t("common.done")} />
      </ScrollView>
    </>
  )
}

const style = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.primaryLightBackground,
  },
  contentContainer: {
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
    ...Typography.header1,
    textAlign: "center",
    marginBottom: Spacing.medium,
  },
  contentText: {
    ...Typography.body2,
    textAlign: "center",
    marginBottom: Spacing.xxxLarge,
  },
})

export default AffectedUserComplete
