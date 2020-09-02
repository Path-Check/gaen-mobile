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

  type Content = {
    bodyText: string
    leftIcon: string
    leftIconFill: string
    rightIcon: string
    onPress: () => void
    accessibilityLabel: string
  }

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
          width={Iconography.medium}
          height={Iconography.medium}
        />
        <View style={style.activationStatusTextContainer}>
          <GlobalText style={style.bottomHeaderText}>{headerText}</GlobalText>
          <GlobalText style={style.bottomBodyText}>
            {content.bodyText}
          </GlobalText>
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
