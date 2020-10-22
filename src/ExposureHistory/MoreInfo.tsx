import React, { FunctionComponent } from "react"
import { View, ScrollView, StyleSheet } from "react-native"
import { useTranslation } from "react-i18next"
import { useStatusBarEffect } from "../navigation/index"

import { Text } from "../components"

import { Spacing, Typography, Colors } from "../styles"

const MoreInfo: FunctionComponent = () => {
  useStatusBarEffect("light-content", Colors.header.background)
  const { t } = useTranslation()

  return (
    <>
      <ScrollView
        style={style.container}
        contentContainerStyle={style.contentContainer}
      >
        <View style={style.section}>
          <Text style={style.headerText}>
            {t("exposure_history.why_did_i_get_an_en")}
          </Text>
          <Text style={style.contentText}>
            {t("exposure_history.why_did_i_get_an_en_para")}
          </Text>
        </View>
        <View style={style.section}>
          <Text style={style.headerText}>
            {t("exposure_history.how_does_this_work")}
          </Text>
          <Text style={style.contentText}>
            {t("exposure_history.how_does_this_work_para")}
          </Text>
        </View>
      </ScrollView>
    </>
  )
}

const style = StyleSheet.create({
  container: {
    backgroundColor: Colors.secondary.shade10,
    padding: Spacing.medium,
  },
  contentContainer: {
    paddingBottom: Spacing.xLarge,
  },
  headerText: {
    ...Typography.header5,
  },
  section: {
    paddingBottom: Spacing.xLarge,
  },
  contentText: {
    ...Typography.body1,
    paddingTop: Spacing.small,
  },
  backIconContainer: {
    marginTop: Spacing.medium,
    padding: Spacing.medium,
    alignItems: "flex-end",
  },
})

export default MoreInfo
