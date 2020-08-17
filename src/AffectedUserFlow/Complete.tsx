import React, { FunctionComponent } from "react"
import { StyleSheet, View } from "react-native"
import { useNavigation } from "@react-navigation/native"
import { useTranslation } from "react-i18next"

import { useStatusBarEffect } from "../navigation"
import { GlobalText } from "../components/GlobalText"
import { Button } from "../components/Button"

import { Screens } from "../navigation"

import { Layout, Spacing, Typography } from "../styles"

export const ExportComplete: FunctionComponent = () => {
  useStatusBarEffect("dark-content")
  const { t } = useTranslation()
  const navigation = useNavigation()

  const handleOnPressDone = () => {
    navigation.navigate(Screens.Home)
  }

  const title = t("export.complete_title")
  const body = t("export.complete_body_bluetooth")
  const doneCaption = t("common.done")

  return (
    <View style={style.container}>
      <View>
        <GlobalText style={style.header}>{title}</GlobalText>
        <GlobalText style={style.contentText}>{body}</GlobalText>
      </View>
      <View style={style.buttonContainer}>
        <Button onPress={handleOnPressDone} label={doneCaption} />
      </View>
    </View>
  )
}

const style = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between",
    paddingTop: Layout.oneTenthHeight,
    paddingHorizontal: Spacing.large,
    paddingBottom: Spacing.xxHuge,
  },
  header: {
    ...Typography.header2,
    paddingBottom: Spacing.small,
  },
  contentText: {
    ...Typography.secondaryContent,
  },
  buttonContainer: {
    alignSelf: "flex-start",
  },
})

export default ExportComplete
