import React, {
  FunctionComponent,
  useRef,
  useEffect,
  useState,
  useCallback,
} from "react"
import {
  StyleSheet,
  Easing,
  Animated,
  AccessibilityInfo,
  View,
  TouchableOpacity,
} from "react-native"
import { useTranslation } from "react-i18next"
import { useNavigation } from "@react-navigation/native"
import { SvgXml } from "react-native-svg"

import { useExposureDetectionStatus } from "../../Device/useExposureDetectionStatus"

import { HomeStackScreens } from "../../navigation"
import { Text } from "../../components"

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

const STATUS_ICON_SIZE = Iconography.small

const ExposureDetectionStatusCard: FunctionComponent = () => {
  const navigation = useNavigation()
  const { t } = useTranslation()
  const { exposureDetectionStatus } = useExposureDetectionStatus()

  const handleOnPressExposureDetectionStatus = () => {
    navigation.navigate(HomeStackScreens.ExposureDetectionStatus)
  }

  const statusBackgroundColor = exposureDetectionStatus
    ? Colors.accent.success25
    : Colors.accent.danger25
  const statusBorderColor = exposureDetectionStatus
    ? Colors.accent.success100
    : Colors.accent.danger100
  const statusIcon = exposureDetectionStatus
    ? Icons.CheckInCircle
    : Icons.XInCircle
  const statusIconFill = exposureDetectionStatus
    ? Colors.accent.success100
    : Colors.accent.danger100
  const statusText = exposureDetectionStatus
    ? t("home.bluetooth.tracing_on_header")
    : t("home.bluetooth.tracing_off_header")
  const actionText = exposureDetectionStatus
    ? t("exposure_scanning_status.learn_more")
    : t("exposure_scanning_status.fix_this")

  const statusContainerStyle = {
    ...style.statusContainer,
    backgroundColor: statusBackgroundColor,
    borderColor: statusBorderColor,
  }

  return (
    <TouchableOpacity
      style={statusContainerStyle}
      accessibilityLabel={statusText}
      testID={"exposure-scanning-status-button"}
      onPress={handleOnPressExposureDetectionStatus}
    >
      <View style={style.statusTopContainer}>
        <Text style={style.statusText} testID={"home-header"}>
          {statusText}
        </Text>
        <View>
          <SvgXml
            xml={statusIcon}
            width={STATUS_ICON_SIZE}
            height={STATUS_ICON_SIZE}
            fill={statusIconFill}
            style={style.statusIcon}
          />
          {exposureDetectionStatus && <ExpandingCircleAnimation />}
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
const ExpandingCircleAnimation: FunctionComponent = () => {
  const [isReduceMotionEnabled, setIsReduceMotionEnabled] = useState<boolean>(
    false,
  )

  const animationTime = 1600
  const delayTime = 2000
  const initialCircleSize = 0
  const endingCircleSize = 600
  const initialTopValue = STATUS_ICON_SIZE / 2
  const endingTopValue = endingCircleSize * -0.46
  const initialOpacity = 0.2
  const endingOpacity = 0.0

  const sizeAnimatedValue = useRef(new Animated.Value(initialCircleSize))
    .current
  const topAnimatedValue = useRef(new Animated.Value(initialTopValue)).current
  const opacityAnimatedValue = useRef(new Animated.Value(initialOpacity))
    .current

  const playAnimation = useCallback(() => {
    Animated.loop(
      Animated.sequence([
        Animated.parallel([
          Animated.timing(sizeAnimatedValue, {
            toValue: endingCircleSize,
            duration: animationTime,
            easing: Easing.quad,
            useNativeDriver: false,
          }),
          Animated.timing(topAnimatedValue, {
            toValue: endingTopValue,
            duration: animationTime,
            easing: Easing.quad,
            useNativeDriver: false,
          }),
          Animated.timing(opacityAnimatedValue, {
            toValue: endingOpacity,
            duration: animationTime,
            easing: Easing.quad,
            useNativeDriver: false,
          }),
          Animated.delay(delayTime),
        ]),
      ]),
    ).start()
  }, [
    endingTopValue,
    opacityAnimatedValue,
    sizeAnimatedValue,
    topAnimatedValue,
  ])

  useEffect(playAnimation, [playAnimation])

  useEffect(() => {
    AccessibilityInfo.isReduceMotionEnabled()?.then((result) => {
      setIsReduceMotionEnabled(result)
    })
  }, [])

  if (isReduceMotionEnabled) {
    return null
  }

  return (
    <Animated.View
      style={{
        position: "absolute",
        top: topAnimatedValue,
        alignSelf: "center",
        width: sizeAnimatedValue,
        height: sizeAnimatedValue,
        borderColor: Colors.accent.success100,
        borderWidth: Outlines.hairline,
        borderRadius: Outlines.borderRadiusMax,
        opacity: opacityAnimatedValue,
      }}
    />
  )
}

const style = StyleSheet.create({
  statusContainer: {
    ...Affordances.floatingContainer,
    paddingVertical: Spacing.small,
    elevation: 0,
    borderWidth: Outlines.thin,
    overflow: "hidden",
  },
  statusTopContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: Spacing.xxxSmall,
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
