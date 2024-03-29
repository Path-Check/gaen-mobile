import React, { FunctionComponent } from "react"
import { TouchableOpacity, View, StyleSheet } from "react-native"
import { SvgXml } from "react-native-svg"
import { useTranslation } from "react-i18next"

import { Text } from "../components"

import { Icons } from "../assets"
import {
  Affordances,
  Colors,
  Iconography,
  Outlines,
  Spacing,
  Typography,
} from "../styles"

type Content = {
  backgroundColor: string
  borderColor: string
  bodyText: string
  statusIcon: string
  actionText: string
  onPress: () => void
  accessibilityLabel: string
  accessibilityHint: string
  chevron: string
}

interface ActivationStatusProps {
  headerText: string
  subheaderText?: string
  isActive: boolean
  infoAction: () => void
  fixAction: () => void
  testID: string
}

const ActivationStatusView: FunctionComponent<ActivationStatusProps> = ({
  headerText,
  subheaderText,
  isActive,
  infoAction,
  fixAction,
  testID,
}) => {
  const { t } = useTranslation()

  const activeContent: Content = {
    backgroundColor: Colors.accent.success25,
    borderColor: Colors.accent.success100,
    bodyText: t("common.on"),
    statusIcon: Icons.CheckInCircle,
    actionText: t("exposure_scanning_status.learn_more"),
    onPress: infoAction,
    accessibilityLabel: t("home.get_more_info", { technology: headerText }),
    accessibilityHint: t("accessibility.hint.navigates_to_new_screen"),
    chevron: Icons.ChevronUp,
  }

  const inactiveContent: Content = {
    backgroundColor: Colors.accent.danger25,
    borderColor: Colors.accent.danger100,
    bodyText: t("common.off"),
    statusIcon: Icons.XInCircle,
    actionText: t("exposure_scanning_status.fix_this"),
    onPress: fixAction,
    accessibilityLabel: t("home.fix", { technology: headerText }),
    accessibilityHint: t("accessibility.hint.navigates_to_new_screen"),
    chevron: Icons.ChevronRight,
  }

  const {
    backgroundColor,
    borderColor,
    bodyText,
    statusIcon,
    actionText,
    onPress,
    accessibilityLabel,
    accessibilityHint,
    chevron,
  } = isActive ? activeContent : inactiveContent

  const outerContainerStyle = {
    ...style.outerContainer,
    backgroundColor: backgroundColor,
    borderColor: borderColor,
  }

  const statusTextContainerStyle = {
    ...style.statusTextContainer,
    backgroundColor: borderColor,
  }

  return (
    <TouchableOpacity
      onPress={onPress}
      style={outerContainerStyle}
      accessible
      accessibilityLabel={accessibilityLabel}
      accessibilityHint={accessibilityHint}
      testID={testID}
    >
      <View style={style.topContainer}>
        <View style={style.topTextContainer}>
          <Text style={style.headerText}>{headerText}</Text>
          {subheaderText && (
            <Text style={style.subheaderText}>{subheaderText}</Text>
          )}
          <View style={statusTextContainerStyle}>
            <Text style={style.statusText}>{bodyText}</Text>
          </View>
        </View>
        <SvgXml
          xml={statusIcon}
          fill={borderColor}
          width={Iconography.medium}
          height={Iconography.medium}
        />
      </View>
      <View style={style.bottomContainer}>
        <Text style={style.actionText}>{actionText}</Text>
        <SvgXml
          xml={chevron}
          fill={Colors.neutral.black}
          width={Iconography.tiny}
          height={Iconography.tiny}
        />
      </View>
    </TouchableOpacity>
  )
}

const style = StyleSheet.create({
  outerContainer: {
    ...Affordances.floatingContainer,
    borderWidth: Outlines.thin,
  },
  topContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    marginBottom: Spacing.small,
  },
  topTextContainer: {
    marginTop: Spacing.xxSmall,
    maxWidth: 240,
  },
  headerText: {
    ...Typography.header.x40,
    color: Colors.neutral.black,
    lineHeight: Typography.lineHeight.x30,
    marginBottom: Spacing.xSmall,
  },
  subheaderText: {
    ...Typography.header.x10,
    color: Colors.neutral.black,
    marginBottom: Spacing.small,
  },
  statusTextContainer: {
    alignSelf: "flex-start",
    paddingVertical: Spacing.xxxSmall,
    paddingHorizontal: Spacing.xxSmall,
    borderRadius: Outlines.baseBorderRadius,
  },
  statusText: {
    ...Typography.body.x20,
    ...Typography.style.bold,
    color: Colors.neutral.white,
    lineHeight: Typography.lineHeight.x20,
  },
  bottomContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  actionText: {
    ...Typography.body.x30,
    color: Colors.neutral.black,
    marginRight: Spacing.xxSmall,
    paddingBottom: 2,
  },
})

export default ActivationStatusView
