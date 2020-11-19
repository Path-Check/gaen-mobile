import React, { FunctionComponent } from "react"
import { ScrollView, View, StyleSheet } from "react-native"
import { useTranslation } from "react-i18next"
import { SvgXml } from "react-native-svg"

import { Text } from "../components"
import { useApplicationName } from "../Device/useApplicationInfo"

import { Typography, Spacing, Colors, Outlines } from "../styles"
import { Icons } from "../assets"

const LocationInfo: FunctionComponent = () => {
  const { t } = useTranslation()
  const { applicationName } = useApplicationName()

  return (
    <ScrollView
      style={style.container}
      contentContainerStyle={style.mainContentContainer}
      alwaysBounceVertical={false}
    >
      <View style={style.textContainer}>
        <View style={style.subheaderContainer}>
          <SvgXml xml={Icons.AlertCircle} fill={Colors.accent.danger150} />
          <Text style={style.subheaderText}>
            {t("home.location_info_subheader", { applicationName })}
          </Text>
        </View>
        <Text style={style.bodyText}>
          {t("home.location_info_body", { applicationName })}
        </Text>
        <Text style={style.subheaderText}>{}</Text>
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
  subheaderContainer: {
    paddingVertical: Spacing.small,
    paddingHorizontal: Spacing.large,
    borderRadius: Outlines.baseBorderRadius,
    borderColor: Colors.accent.danger150,
    borderWidth: Outlines.thin,
    marginBottom: Spacing.small,
    flexDirection: "row",
    alignItems: "center",
  },
  subheaderText: {
    ...Typography.header.x20,
    color: Colors.accent.danger150,
    paddingLeft: Spacing.medium,
    paddingRight: Spacing.large,
  },
  bodyText: {
    ...Typography.body.x30,
    marginBottom: Spacing.xxLarge,
  },
})

export default LocationInfo
