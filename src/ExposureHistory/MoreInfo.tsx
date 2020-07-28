import React, { FunctionComponent } from "react"
import { View, ScrollView, StyleSheet } from "react-native"
import { useTranslation } from "react-i18next"

import { RTLEnabledText } from "../components/RTLEnabledText"
import { useStatusBarEffect } from "../navigation"

import { Spacing, Typography, Colors } from "../styles"

const MoreInfo: FunctionComponent = () => {
  const { t } = useTranslation()
  useStatusBarEffect("light-content")

  return (
    <>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
      >
        <View style={styles.section}>
          <RTLEnabledText style={styles.headerText}>
            {t("exposure_history.why_did_i_get_an_en")}
          </RTLEnabledText>
          <RTLEnabledText style={styles.contentText}>
            {t("exposure_history.why_did_i_get_an_en_para")}
          </RTLEnabledText>
        </View>
        <View style={styles.section}>
          <RTLEnabledText style={styles.headerText}>
            {t("exposure_history.how_does_this_work")}
          </RTLEnabledText>
          <RTLEnabledText style={styles.contentText}>
            {t("exposure_history.how_does_this_work_para")}
          </RTLEnabledText>
        </View>
      </ScrollView>
    </>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.primaryBackground,
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
