import React, { FunctionComponent } from "react"
import { ScrollView, View, StyleSheet } from "react-native"
import { useTranslation } from "react-i18next"

import { Text } from "../components"

import { Typography, Spacing, Colors } from "../styles"

const ExposureNotificationsInfo: FunctionComponent = () => {
  const { t } = useTranslation()

  return (
    <ScrollView
      style={style.container}
      contentContainerStyle={style.mainContentContainer}
      alwaysBounceVertical={false}
    >
      <View style={style.textContainer}>
        <Text style={style.subheaderText}>
          {t("home.proximity_tracing_info_subheader_1")}
        </Text>
        <Text style={style.bodyText}>
          {t("home.proximity_tracing_info_body_1")}
        </Text>
        <Text style={style.subheaderText}>
          {t("home.proximity_tracing_info_subheader_2")}
        </Text>
        <Text style={style.bodyText}>
          {t("home.proximity_tracing_info_body_2")}
        </Text>
      </View>
    </ScrollView>
  )
}

const style = StyleSheet.create({
  container: {
    backgroundColor: Colors.background.primaryLight,
  },
  mainContentContainer: {
    paddingTop: Spacing.large,
    paddingBottom: Spacing.huge,
  },
  textContainer: {
    paddingHorizontal: Spacing.large,
    marginBottom: Spacing.small,
  },
  subheaderText: {
    ...Typography.body.x30,
    ...Typography.style.medium,
    color: Colors.text.primary,
    marginBottom: Spacing.medium,
  },
  bodyText: {
    ...Typography.body.x30,
    marginBottom: Spacing.xxLarge,
  },
})

export default ExposureNotificationsInfo
