import React, { FunctionComponent } from "react"
import { useTranslation } from "react-i18next"
import { TouchableOpacity, View, StyleSheet } from "react-native"
import { SvgXml } from "react-native-svg"

import { GlobalText } from "../components"

import { Icons } from "../assets"
import { Colors, Iconography, Outlines, Spacing, Typography } from "../styles"

interface ActivationStatusProps {
  headerText: string
  isActive: boolean
  infoAction: () => void
  fixAction: () => void
  testID: string
}

export const ActivationStatus: FunctionComponent<ActivationStatusProps> = ({
  headerText,
  isActive,
  infoAction,
  fixAction,
  testID,
}) => {
  const { t } = useTranslation()

  const bodyText = isActive ? t("common.enabled") : t("common.disabled")
  const leftIcon = isActive ? Icons.CheckInCircle : Icons.XInCircle
  const leftIconFill = isActive ? Colors.success100 : Colors.danger75
  const rightIcon = isActive ? Icons.HomeInfo : Icons.Wrench
  const onPress = isActive ? infoAction : fixAction
  const accessibilityLabel = isActive
    ? t("home.get_more_info", { technology: headerText })
    : t("home.fix", { technology: headerText })

  return (
    <TouchableOpacity
      onPress={onPress}
      style={style.activationStatusContainer}
      accessible
      accessibilityLabel={accessibilityLabel}
      testID={testID}
    >
      <View style={style.activationStatusLeftContainer}>
        <SvgXml
          xml={leftIcon}
          fill={leftIconFill}
          width={Iconography.medium}
          height={Iconography.medium}
        />
        <View style={style.activationStatusTextContainer}>
          <GlobalText style={style.bottomHeaderText}>{headerText}</GlobalText>
          <GlobalText style={style.bottomBodyText}>{bodyText}</GlobalText>
        </View>
      </View>
      <View style={style.activationStatusRightContainer}>
        <SvgXml xml={rightIcon} />
      </View>
    </TouchableOpacity>
  )
}

const rightColumnWidth = 70
const style = StyleSheet.create({
  activationStatusContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: Spacing.large,
    marginHorizontal: Spacing.small,
    borderBottomWidth: Outlines.hairline,
    borderBottomColor: Colors.neutral10,
  },
  activationStatusLeftContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  activationStatusTextContainer: {
    marginLeft: Spacing.medium,
  },
  activationStatusRightContainer: {
    width: rightColumnWidth,
    alignItems: "center",
  },
  bottomHeaderText: {
    ...Typography.header4,
    marginBottom: Spacing.xxxSmall,
  },
  bottomBodyText: {
    ...Typography.header6,
    color: Colors.neutral100,
  },
})
