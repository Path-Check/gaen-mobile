import React, { FunctionComponent } from "react"
import { useTranslation } from "react-i18next"
import { TouchableOpacity, View, StyleSheet } from "react-native"
import { SvgXml } from "react-native-svg"

import { Text } from "../components"

import { Icons } from "../assets"
import { Colors, Iconography, Outlines, Spacing, Typography } from "../styles"

type Content = {
  bodyText: string
  leftIcon: string
  leftIconFill: string
  rightIcon: string
  onPress: () => void
  accessibilityLabel: string
}

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

  const activeContent: Content = {
    bodyText: t("common.enabled"),
    leftIcon: Icons.CheckInCircle,
    leftIconFill: Colors.success100,
    rightIcon: Icons.HomeInfo,
    onPress: infoAction,
    accessibilityLabel: t("home.get_more_info", { technology: headerText }),
  }

  const inactiveContent: Content = {
    bodyText: t("common.disabled"),
    leftIcon: Icons.XInCircle,
    leftIconFill: Colors.danger75,
    rightIcon: Icons.Wrench,
    onPress: fixAction,
    accessibilityLabel: t("home.fix", { technology: headerText }),
  }

  const content = isActive ? activeContent : inactiveContent

  return (
    <TouchableOpacity
      onPress={content.onPress}
      style={style.activationStatusContainer}
      accessible
      accessibilityLabel={content.accessibilityLabel}
      testID={testID}
    >
      <View style={style.activationStatusLeftContainer}>
        <SvgXml
          xml={content.leftIcon}
          fill={content.leftIconFill}
          width={Iconography.small}
          height={Iconography.small}
        />
        <View style={style.activationStatusTextContainer}>
          <Text style={style.bottomHeaderText}>{headerText}</Text>
          <Text style={style.bottomBodyText}>{content.bodyText}</Text>
        </View>
      </View>
      <View style={style.activationStatusRightContainer}>
        <SvgXml xml={content.rightIcon} />
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
    paddingVertical: Spacing.xSmall,
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
    ...Typography.body1,
    color: Colors.black,
    lineHeight: Typography.smallLineHeight,
  },
  bottomBodyText: {
    ...Typography.body2,
    color: Colors.neutral75,
    lineHeight: Typography.xSmallLineHeight,
  },
})
