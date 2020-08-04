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

import { GlobalText } from "../components/GlobalText"

import {
  getVersion,
  getBuildNumber,
  getApplicationName,
} from "../gaen/nativeModule"

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
        <GlobalText style={style.headerContent}>
          {getApplicationName()}
        </GlobalText>
      </View>
      <GlobalText style={style.aboutContent}>
        {t("label.about_para")}
      </GlobalText>
      <GlobalText
        style={style.hyperlink}
        onPress={() => {
          Linking.openURL(pathCheckUrl)
        }}
      >
        <Text>{pathCheckWebAddress}</Text>
      </GlobalText>
      <View style={style.infoRowContainer}>
        <View style={style.infoRow}>
          <GlobalText style={style.aboutSectionParaLabel}>
            {t("about.version")}
          </GlobalText>
          <GlobalText style={style.aboutSectionParaContent}>
            {versionInfo}
          </GlobalText>
        </View>
        <View style={style.infoRow}>
          <GlobalText style={style.aboutSectionParaLabel}>
            {t("about.operating_system_abbr")}
          </GlobalText>
          <GlobalText style={style.aboutSectionParaContent}>
            {osInfo}
          </GlobalText>
        </View>
      </View>
    </ScrollView>
  )
}

const style = StyleSheet.create({
  contentContainer: {
    flex: 1,
    backgroundColor: Colors.primaryBackground,
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
