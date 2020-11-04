import React, { FunctionComponent } from "react"
import { View, TouchableOpacity, StyleSheet } from "react-native"
import { SvgXml } from "react-native-svg"
import { useNavigation } from "@react-navigation/native"
import { useTranslation } from "react-i18next"

import { useProductAnalyticsContext } from "../ProductAnalytics/Context"
import { Text } from "../components"
import { ModalStackScreens } from "../navigation"
import { Icons } from "../assets"
import { Colors, Iconography, Typography, Spacing } from "../styles"

const ShareAnonymizedDataListItem: FunctionComponent = () => {
  const { t } = useTranslation()
  const navigation = useNavigation()
  const { userConsentedToAnalytics } = useProductAnalyticsContext()

  const onPressShareAnonymizedData = () => {
    navigation.navigate(ModalStackScreens.AnonymizedDataConsent)
  }

  const rightIconColor = userConsentedToAnalytics
    ? Colors.accent.success100
    : Colors.accent.danger75
  const rightIcon = userConsentedToAnalytics
    ? Icons.CheckInCircle
    : Icons.XInCircle
  const testID = userConsentedToAnalytics ? "sharing-data" : "not-sharing-data"
  const accessibilityLabel = userConsentedToAnalytics
    ? t("settings.sharing_anonymized_data")
    : t("settings.not_sharing_anonymized_data")

  return (
    <TouchableOpacity
      onPress={onPressShareAnonymizedData}
      accessible
      accessibilityLabel={accessibilityLabel}
    >
      <View style={style.listItem}>
        <View style={style.leftContent}>
          <SvgXml
            fill={Colors.primary.shade100}
            xml={Icons.BarGraph}
            width={Iconography.small}
            height={Iconography.small}
            style={style.icon}
            accessible
            accessibilityLabel={accessibilityLabel}
            testID={testID}
          />
          <Text style={style.listItemText}>
            {t("settings.share_anonymized_data")}
          </Text>
        </View>
        <SvgXml
          fill={rightIconColor}
          xml={rightIcon}
          width={Iconography.small}
          height={Iconography.small}
          style={style.rightIcon}
        />
      </View>
    </TouchableOpacity>
  )
}

const style = StyleSheet.create({
  icon: {
    marginRight: Spacing.small,
  },
  listItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: Spacing.medium,
    paddingVertical: Spacing.large,
    justifyContent: "space-between",
  },
  leftContent: {
    flexDirection: "row",
  },
  listItemText: {
    ...Typography.button.listItem,
  },
  rightIcon: {
    paddingRight: Spacing.medium,
  },
})
export default ShareAnonymizedDataListItem
