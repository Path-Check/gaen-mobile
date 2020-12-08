import React, { FunctionComponent } from "react"
import { ScrollView, Image, StyleSheet, TouchableOpacity } from "react-native"
import { useNavigation } from "@react-navigation/native"
import { useTranslation } from "react-i18next"

import { StatusBar, Text } from "../components"
import { useStatusBarEffect, Stacks } from "../navigation"

import { Images } from "../assets"
import { Buttons, Colors, Layout, Spacing, Typography } from "../styles"

export const Complete: FunctionComponent = () => {
  useStatusBarEffect("dark-content", Colors.background.primaryLight)
  const navigation = useNavigation()
  const { t } = useTranslation()

  const handleOnPressDone = () => {
    navigation.navigate("App", { screen: Stacks.Home })
  }

  return (
    <>
      <StatusBar backgroundColor={Colors.background.primaryLight} />
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
        <TouchableOpacity
          style={style.button}
          onPress={handleOnPressDone}
          accessibilityLabel={t("common.done")}
        >
          <Text style={style.buttonText}>{t("common.done")}</Text>
        </TouchableOpacity>
      </ScrollView>
    </>
  )
}

const style = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background.primaryLight,
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
    ...Typography.header.x60,
    textAlign: "center",
    marginBottom: Spacing.medium,
  },
  contentText: {
    ...Typography.body.x30,
    textAlign: "center",
    marginBottom: Spacing.xxxLarge,
  },
  button: {
    ...Buttons.primary.base,
  },
  buttonText: {
    ...Typography.button.primary,
  },
})

export default Complete
