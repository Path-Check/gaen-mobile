import React, { FunctionComponent } from "react"
import { ScrollView, View, StyleSheet } from "react-native"
import { useTranslation } from "react-i18next"

import { Text } from "../components"

import { Typography, Spacing, Colors } from "../styles"

const LocationInfo: FunctionComponent = () => {
  const { t } = useTranslation()

  return (
    <ScrollView
      style={style.container}
      contentContainerStyle={style.mainContentContainer}
      alwaysBounceVertical={false}
    >
      <View style={style.textContainer}>
        <Text style={style.subheaderText}>
          {t("home.location_info_subheader_1")}
        </Text>
        <Text style={style.bodyText}>{t("home.location_info_body_1")}</Text>
      </View>
    </ScrollView>
  )
}

const style = StyleSheet.create({
  container: {
    backgroundColor: Colors.primaryLightBackground,
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
    ...Typography.body1,
    ...Typography.mediumBold,
    color: Colors.primaryText,
    marginBottom: Spacing.medium,
  },
  bodyText: {
    ...Typography.body1,
    marginBottom: Spacing.xxLarge,
  },
})

export default LocationInfo
