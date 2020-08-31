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
  const icon = isActive ? Icons.CheckInCircle : Icons.XInCircle
  const iconFill = isActive ? Colors.success100 : Colors.danger75

  return (
    <TouchableOpacity
      onPress={isActive ? infoAction : fixAction}
      style={style.activationStatusContainer}
      testID={testID}
    >
      <View style={style.activationStatusLeftContainer}>
        <SvgXml
          xml={icon}
          fill={iconFill}
          width={Iconography.medium}
          height={Iconography.medium}
        />
        <View style={style.activationStatusTextContainer}>
          <GlobalText style={style.bottomHeaderText}>{headerText}</GlobalText>
          <GlobalText style={style.bottomBodyText}>{bodyText}</GlobalText>
        </View>
      </View>
      <View style={style.activationStatusRightContainer}>
        {isActive ? (
          <SvgXml xml={Icons.HomeInfo} />
        ) : (
          <View style={style.fixButtonContainer}>
            <GlobalText style={style.fixButtonText}>
              {t("home.bluetooth.fix")}
            </GlobalText>
          </View>
        )}
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
  fixButtonContainer: {
    alignItems: "center",
    backgroundColor: Colors.secondary50,
    paddingVertical: Spacing.xxxSmall,
    paddingHorizontal: Spacing.small,
    borderRadius: Outlines.baseBorderRadius,
  },
  fixButtonText: {
    ...Typography.header4,
    color: Colors.primary100,
    textTransform: "uppercase",
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
