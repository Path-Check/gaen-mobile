import React, { FunctionComponent } from "react"
import { ScrollView, Text, StyleSheet } from "react-native"
import { useTranslation } from "react-i18next"

import { useStatusBarEffect } from "../navigation"
import { GradientBackground, StatusBar } from "../components"

import { Colors } from "../styles"

const ConnectScreen: FunctionComponent = () => {
  useStatusBarEffect("dark-content", Colors.gradientPrimary20Lighter)
  const { t } = useTranslation()

  return (
    <>
      <StatusBar backgroundColor={Colors.gradientPrimary20Lighter} />
      <GradientBackground gradient={Colors.gradientPrimary20}>
        <ScrollView style={style.container}>
          <Text>{t("navigation.connect")}</Text>
        </ScrollView>
      </GradientBackground>
    </>
  )
}

const style = StyleSheet.create({
  container: {
    flex: 1,
  },
})

export default ConnectScreen
