import React, { FunctionComponent } from "react"
import { TouchableOpacity, StyleSheet, View } from "react-native"
import { useTranslation } from "react-i18next"
import { useNavigation } from "@react-navigation/native"
import { SvgXml } from "react-native-svg"

import AnimatedCircle from "./AnimatedCircle"
import { HomeStackScreens } from "../../navigation"
import { Text } from "../../components"
import { usePermissionsContext } from "../../Device/PermissionsContext"

import { Icons } from "../../assets"
import {
  Layout,
  Spacing,
  Colors,
  Typography,
  Outlines,
  Iconography,
  Affordances,
} from "../../styles"

const ExposureDetectionStatusCard: FunctionComponent = () => {
  const navigation = useNavigation()
  const { t } = useTranslation()
  const { exposureNotifications } = usePermissionsContext()

  const handleOnPressExposureDetectionStatus = () => {
    navigation.navigate(HomeStackScreens.ExposureDetectionStatus)
  }

  const enabledConfig = {
    statusBackgroundColor: Colors.accent.success25,
    statusBorderColor: Colors.accent.success100,
    statusIcon: Icons.CheckInCircle,
    statusIconFill: Colors.accent.success100,
    statusText: t("home.bluetooth.tracing_on_header"),
    actionText: t("exposure_scanning_status.learn_more"),
  }

  const disabledConfig = {
    statusBackgroundColor: Colors.accent.danger25,
    statusBorderColor: Colors.accent.danger100,
    statusIcon: Icons.XInCircle,
    statusIconFill: Colors.accent.danger100,
    statusText: t("home.bluetooth.tracing_off_header"),
    actionText: t("exposure_scanning_status.fix_this"),
  }

  const {
    statusBackgroundColor,
    statusBorderColor,
    statusIcon,
    statusIconFill,
    statusText,
    actionText,
  } = exposureNotifications.status === "Active" ? enabledConfig : disabledConfig

  const statusContainerStyle = {
    ...style.statusContainer,
    backgroundColor: statusBackgroundColor,
    borderColor: statusBorderColor,
  }

  const iconSize = Iconography.small

  const animatedCircleContainerStyle = {
    ...style.animatedCircleContainer,
    right: iconSize / 2,
  }

  return (
    <TouchableOpacity
      style={statusContainerStyle}
      accessibilityLabel={statusText}
      testID={"exposure-scanning-status-button"}
      onPress={handleOnPressExposureDetectionStatus}
    >
      <View style={style.statusTopContainer}>
        <View style={style.statusTextContainer}>
          <Text style={style.statusText} testID="home-header">
            {statusText}
          </Text>
        </View>
        <View style={style.iconContainer}>
          <SvgXml
            xml={statusIcon}
            width={iconSize}
            height={iconSize}
            fill={statusIconFill}
            style={style.statusIcon}
          />
          {exposureNotifications.status === "Active" && (
            <View style={animatedCircleContainerStyle}>
              <AnimatedCircle iconSize={iconSize} />
            </View>
          )}
        </View>
      </View>
      <View style={style.statusBottomContainer}>
        <Text style={style.statusActionText}>{actionText}</Text>
        <SvgXml
          xml={Icons.ChevronRight}
          fill={Colors.neutral.black}
          width={Iconography.tiny}
          height={Iconography.tiny}
        />
      </View>
    </TouchableOpacity>
  )
}

const style = StyleSheet.create({
  statusContainer: {
    ...Affordances.floatingContainer,
    paddingVertical: Spacing.medium,
    elevation: 0,
    borderWidth: Outlines.thin,
    overflow: "hidden",
  },
  statusTopContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    marginBottom: Spacing.xxxSmall,
  },
  statusTextContainer: {
    flex: 5,
  },
  iconContainer: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "flex-end",
  },
  animatedCircleContainer: {
    position: "absolute",
  },
  statusIcon: {
    zIndex: Layout.zLevel1,
  },
  statusText: {
    ...Typography.header.x40,
    color: Colors.neutral.black,
  },
  statusBottomContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  statusActionText: {
    ...Typography.body.x20,
    color: Colors.neutral.black,
    marginRight: Spacing.xxxSmall,
    paddingBottom: 2,
  },
})

export default ExposureDetectionStatusCard
