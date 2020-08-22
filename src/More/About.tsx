import React, { FunctionComponent } from "react"
import { useTranslation } from "react-i18next"
import { Platform, ScrollView, StyleSheet, View } from "react-native"
import env from "react-native-config"

import { GlobalText } from "../components/GlobalText"

import { Colors, Spacing, Typography } from "../styles"
import { useApplicationInfo } from "./useApplicationInfo"

export const AboutScreen: FunctionComponent = () => {
  const { t } = useTranslation()
  const osInfo = `${Platform.OS} v${Platform.Version}`
  const { applicationName, versionInfo } = useApplicationInfo()
  const { GAEN_AUTHORITY_NAME: healthAuthorityName } = env

  return (
    <ScrollView
      contentContainerStyle={style.contentContainer}
      alwaysBounceVertical={false}
    >
      <View>
        <GlobalText style={style.headerContent}>{applicationName}</GlobalText>
      </View>
      <GlobalText style={style.aboutContent}>
        {t("about.description", { applicationName, healthAuthorityName })}
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
    backgroundColor: Colors.primaryLightBackground,
    paddingTop: Spacing.large,
    paddingHorizontal: Spacing.small,
  },
  headerContent: {
    ...Typography.header2,
    marginBottom: Spacing.small,
    color: Colors.primary150,
  },
  aboutContent: {
    ...Typography.body1,
  },
  aboutSectionParaLabel: {
    ...Typography.header5,
    color: Colors.primary150,
    width: 100,
    marginTop: Spacing.small,
  },
  aboutSectionParaContent: {
    ...Typography.body1,
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
