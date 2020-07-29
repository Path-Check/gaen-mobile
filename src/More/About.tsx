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
  const osInfo = `${Platform.OS} v${Platform.Version}`
  const pathCheckWebAddress = "pathcheck.org"
  const pathCheckUrl = "https://pathcheck.org/"

  return (
    <ScrollView
      contentContainerStyle={style.contentContainer}
      alwaysBounceVertical={false}
    >
      <View>
        <RTLEnabledText style={style.headerContent}>
          {getApplicationName()}
        </RTLEnabledText>
      </View>
      <RTLEnabledText style={style.aboutContent}>
        {t("label.about_para")}
      </RTLEnabledText>
      <RTLEnabledText
        style={style.hyperlink}
        onPress={() => {
          Linking.openURL(pathCheckUrl)
        }}
      >
        <Text>{pathCheckWebAddress}</Text>
      </RTLEnabledText>
      <View style={style.infoRowContainer}>
        <View style={style.infoRow}>
          <RTLEnabledText style={style.aboutSectionParaLabel}>
            {t("about.version")}
          </RTLEnabledText>
          <RTLEnabledText style={style.aboutSectionParaContent}>
            {versionInfo}
          </RTLEnabledText>
        </View>
        <View style={style.infoRow}>
          <RTLEnabledText style={style.aboutSectionParaLabel}>
            {t("about.operating_system_abbr")}
          </RTLEnabledText>
          <RTLEnabledText style={style.aboutSectionParaContent}>
            {osInfo}
          </RTLEnabledText>
        </View>
      </View>
    </ScrollView>
  )
}

const style = StyleSheet.create({
  contentContainer: {
    flex: 1,
    backgroundColor: Colors.primaryBackgroundFaintShade,
    paddingTop: Spacing.large,
    paddingHorizontal: Spacing.small,
  },
  headerContent: {
    ...Typography.header3,
    marginBottom: Spacing.small,
  },
  hyperlink: {
    ...Typography.secondaryContent,
    color: Colors.linkText,
    textDecorationLine: "underline",
  },
  aboutContent: {
    ...Typography.secondaryContent,
  },
  aboutSectionParaLabel: {
    ...Typography.header5,
    width: 100,
    marginTop: Spacing.small,
  },
  aboutSectionParaContent: {
    ...Typography.mainContent,
    marginTop: Spacing.small,
  },
  infoRowContainer: {
    marginTop: Spacing.medium,
  },
  infoRow: {
    flexDirection: "row",
  },
})

export default AboutScreen
