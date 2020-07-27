import React, { FunctionComponent } from "react"
import { TouchableOpacity, View, ScrollView, StyleSheet } from "react-native"
import { useTranslation } from "react-i18next"
import { SvgXml } from "react-native-svg"
import { useNavigation } from "@react-navigation/native"

import { RTLEnabledText } from "../components/RTLEnabledText"
import { useStatusBarEffect } from "../navigation"
import { Icons } from "../assets"

import { Colors, Spacing, Typography } from "../styles"

const CloseButton = () => {
  const navigation = useNavigation()

  return (
    <TouchableOpacity
      onPress={() => navigation.goBack()}
      style={styles.backIconContainer}
    >
      <SvgXml xml={Icons.Close} fill={Colors.quaternaryViolet} />
    </TouchableOpacity>
  )
}

const MoreInfo: FunctionComponent = () => {
  const { t } = useTranslation()
  useStatusBarEffect("dark-content")

  return (
    <>
      <CloseButton />
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
    padding: Spacing.medium,
  },
  contentContainer: {
    paddingBottom: Spacing.xLarge,
  },
  headerText: {
    ...Typography.header3,
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
