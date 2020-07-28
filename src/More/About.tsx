import React, { FunctionComponent } from "react"
import { useTranslation } from "react-i18next"
import {
  Linking,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native"
import {
  getApplicationName,
  getBuildNumber,
  getVersion,
} from "react-native-device-info"

import { RTLEnabledText } from "../components/RTLEnabledText"

import { Colors, Spacing, Typography } from "../styles"

export const AboutScreen: FunctionComponent = () => {
  const { t } = useTranslation()

  const versionInfo = `${getVersion()} (${getBuildNumber()})`

  return (
    <ScrollView
      contentContainerStyle={styles.contentContainer}
      alwaysBounceVertical={false}
    >
      <View>
        <RTLEnabledText style={styles.headerContent}>
          {getApplicationName()}
        </RTLEnabledText>
      </View>
      <RTLEnabledText style={styles.aboutContent}>
        {t("label.about_para")}
      </RTLEnabledText>
      <RTLEnabledText
        style={styles.hyperlink}
        onPress={() => {
          Linking.openURL("https://pathcheck.org/")
        }}
      >
        <Text>pathcheck.org</Text>
      </RTLEnabledText>

      <View style={styles.rowContainer}>
        <View style={styles.row}>
          <RTLEnabledText style={styles.aboutSectionParaLabel}>
            {t("about.version")}
          </RTLEnabledText>

          <RTLEnabledText style={styles.aboutSectionParaContent}>
            {versionInfo}
          </RTLEnabledText>
        </View>
        <View style={styles.row}>
          <RTLEnabledText style={styles.aboutSectionParaLabel}>
            {t("about.operating_system_abbr")}
          </RTLEnabledText>
          <RTLEnabledText style={styles.aboutSectionParaContent}>
            {Platform.OS + " v" + Platform.Version}
          </RTLEnabledText>
        </View>
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  contentContainer: {
    backgroundColor: Colors.primaryBackground,
    paddingHorizontal: Spacing.medium,
    paddingTop: Spacing.huge,
    flex: 1,
  },
  headerContent: {
    ...Typography.header2,
    marginBottom: Spacing.small,
  },
  hyperlink: {
    color: Colors.linkText,
    textDecorationLine: "underline",
  },
  aboutContent: {
    ...Typography.secondaryContent,
  },
  aboutSectionParaLabel: {
    ...Typography.header5,
    width: Spacing.xxxHuge * 2,
    marginTop: Spacing.small,
  },
  aboutSectionParaContent: {
    ...Typography.mainContent,
    marginTop: Spacing.small,
  },
  rowContainer: {
    marginTop: Spacing.medium,
  },
  row: {
    flexDirection: "row",
  },
})

export default AboutScreen
