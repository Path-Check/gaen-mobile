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
    backgroundColor: Colors.success10,
    borderColor: Colors.success100,
    bodyText: t("common.on"),
    statusIcon: Icons.CheckInCircle,
    actionText: t("exposure_scanning_status.learn_more"),
    onPress: infoAction,
    accessibilityLabel: t("home.get_more_info", { technology: headerText }),
  }

  const inactiveContent: Content = {
    backgroundColor: Colors.danger10,
    borderColor: Colors.danger100,
    bodyText: t("common.off"),
    statusIcon: Icons.XInCircle,
    actionText: t("exposure_scanning_status.fix_this"),
    onPress: fixAction,
    accessibilityLabel: t("home.fix", { technology: headerText }),
  }

  const content = isActive ? activeContent : inactiveContent

  const {
    backgroundColor,
    borderColor,
    bodyText,
    statusIcon,
    actionText,
    onPress,
    accessibilityLabel,
  } = content

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
      testID={testID}
    >
      <View style={style.topContainer}>
        <View style={style.topTextContainer}>
          <Text style={style.systemServiceText}>{headerText}</Text>
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
          xml={Icons.ChevronRight}
          fill={Colors.black}
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
    borderWidth: Outlines.hairline,
  },
  topContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    marginBottom: Spacing.small,
  },
  topTextContainer: {
    marginTop: Spacing.xxSmall,
    borderColor: Colors.neutral10,
  },
  systemServiceText: {
    ...Typography.header3,
    color: Colors.black,
    lineHeight: Typography.smallLineHeight,
    marginBottom: Spacing.xSmall,
  },
  statusTextContainer: {
    alignSelf: "flex-start",
    paddingVertical: Spacing.xxxSmall,
    paddingHorizontal: Spacing.xxSmall,
    borderRadius: Outlines.baseBorderRadius,
  },
  statusText: {
    ...Typography.body2,
    ...Typography.mediumBold,
    color: Colors.white,
    lineHeight: Typography.xSmallLineHeight,
  },
  bottomContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  actionText: {
    ...Typography.body1,
    color: Colors.black,
    marginRight: Spacing.xxSmall,
    paddingBottom: 2,
  },
})
