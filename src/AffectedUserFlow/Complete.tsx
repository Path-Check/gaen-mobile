import React, { FunctionComponent } from "react"
import { TouchableOpacity, StyleSheet, View, SafeAreaView } from "react-native"
import { useNavigation } from "@react-navigation/native"
import { useTranslation } from "react-i18next"

import { useStatusBarEffect } from "../navigation"
import { GlobalText } from "../components/GlobalText"

import { Stacks } from "../navigation"

import { Layout, Spacing, Colors, Buttons, Typography } from "../styles"

export const ExportComplete: FunctionComponent = () => {
  useStatusBarEffect("dark-content")
  const { t } = useTranslation()
  const navigation = useNavigation()

  const handleOnPressDone = () => {
    navigation.navigate(Stacks.More)
  }

  const title = t("export.complete_title")
  const body = t("export.complete_body_bluetooth")

  return (
    <View style={style.backgroundImage}>
      <SafeAreaView style={{ flex: 1 }}>
        <View style={style.container}>
          <View>
            <GlobalText style={style.header}>{title}</GlobalText>
            <GlobalText style={style.contentText}>{body}</GlobalText>
          </View>

          <TouchableOpacity style={style.button} onPress={handleOnPressDone}>
            <GlobalText style={style.buttonText}>{t("common.done")}</GlobalText>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </View>
  )
}

const style = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "space-between",
    paddingTop: Layout.oneTenthHeight,
    paddingHorizontal: Spacing.large,
    paddingBottom: Spacing.large,
  },
  backgroundImage: {
    flex: 1,
    backgroundColor: Colors.primaryBackground,
    width: "100%",
    height: "100%",
  },
  header: {
    ...Typography.header2,
    paddingBottom: Spacing.small,
  },
  contentText: {
    ...Typography.secondaryContent,
  },
  button: {
    ...Buttons.primary,
  },
  buttonText: {
    ...Typography.buttonPrimaryText,
  },
})

export default ExportComplete
