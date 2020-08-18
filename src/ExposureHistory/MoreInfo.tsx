import React, { FunctionComponent } from "react"
import { View, ScrollView, StyleSheet } from "react-native"
import { useTranslation } from "react-i18next"

import { GlobalText } from "../components/GlobalText"
import { useStatusBarEffect } from "../navigation"

import { Spacing, Typography, Colors } from "../styles"

const MoreInfo: FunctionComponent = () => {
  const { t } = useTranslation()
  useStatusBarEffect("light-content")

  return (
    <>
      <ScrollView
        style={style.container}
        contentContainerStyle={style.contentContainer}
      >
        <View style={style.section}>
          <GlobalText style={style.headerText}>
            {t("exposure_history.why_did_i_get_an_en")}
          </GlobalText>
          <GlobalText style={style.contentText}>
            {t("exposure_history.why_did_i_get_an_en_para")}
          </GlobalText>
        </View>
        <View style={style.section}>
          <GlobalText style={style.headerText}>
            {t("exposure_history.how_does_this_work")}
          </GlobalText>
          <GlobalText style={style.contentText}>
            {t("exposure_history.how_does_this_work_para")}
          </GlobalText>
        </View>
      </ScrollView>
    </>
  )
}

const style = StyleSheet.create({
  container: {
    backgroundColor: Colors.primaryLightBackground,
    padding: Spacing.medium,
  },
  contentContainer: {
    paddingBottom: Spacing.xLarge,
  },
  headerText: {
    ...Typography.header6,
    fontSize: Typography.large,
  },
  section: {
    paddingBottom: Spacing.xLarge,
  },
  contentText: {
    ...Typography.mainContent,
    paddingTop: Spacing.small,
  },
  backIconContainer: {
    marginTop: Spacing.medium,
    padding: Spacing.medium,
    alignItems: "flex-end",
  },
})

export default MoreInfo
