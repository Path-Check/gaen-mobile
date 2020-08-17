import React from "react"
import { StyleSheet, View, ScrollView } from "react-native"
import { useTranslation } from "react-i18next"
import { useNavigation } from "@react-navigation/native"
import { SvgXml } from "react-native-svg"

import { GlobalText } from "../components/GlobalText"
import { Button } from "../components/Button"
import { useStatusBarEffect } from "../navigation"

import { Screens } from "../navigation"

import { Icons } from "../assets"
import { Outlines, Iconography, Spacing, Colors, Typography } from "../styles"

export const ExportIntro = (): JSX.Element => {
  const { t } = useTranslation()
  const navigation = useNavigation()

  useStatusBarEffect("light-content")

  const handleOnPressNext = () => {
    navigation.navigate(Screens.AffectedUserCodeInput)
  }

  const title = t("export.start_body_bluetooth")
  const body = t("export.start_title_bluetooth")

  return (
    <ScrollView contentContainerStyle={style.contentContainer}>
      <View style={style.headerContainer}>
        <View style={style.iconContainerCircle}>
          <SvgXml
            xml={Icons.Heart}
            width={Iconography.small}
            height={Iconography.small}
          />
        </View>

        <GlobalText style={style.header}>{title}</GlobalText>
        <GlobalText style={style.contentText}>{body}</GlobalText>
      </View>
      <View style={style.buttonContainer}>
        <Button invert label={t("common.start")} onPress={handleOnPressNext} />
      </View>
    </ScrollView>
  )
}

const style = StyleSheet.create({
  contentContainer: {
    height: "100%",
    justifyContent: "space-between",
    paddingHorizontal: Spacing.large,
    paddingVertical: Spacing.xxxHuge,
    backgroundColor: Colors.primaryBlue,
  },
  headerContainer: {
    marginBottom: Spacing.xxHuge,
  },
  header: {
    ...Typography.header2,
    color: Colors.white,
  },
  iconContainerCircle: {
    ...Iconography.largeIcon,
    borderRadius: Outlines.borderRadiusMax,
    backgroundColor: Colors.primaryBackground,
    marginBottom: Spacing.large,
  },
  contentText: {
    ...Typography.secondaryContent,
    color: Colors.white,
    paddingTop: Spacing.medium,
  },
  buttonContainer: {
    alignSelf: "flex-start",
  },
})

export default ExportIntro
