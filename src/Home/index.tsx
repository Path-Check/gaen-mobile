import React, {
  FunctionComponent,
  useRef,
  useEffect,
  useState,
  useCallback,
} from "react"
import {
  Easing,
  Animated,
  AccessibilityInfo,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  View,
} from "react-native"
import { useTranslation } from "react-i18next"
import { useNavigation } from "@react-navigation/native"
import { SvgXml } from "react-native-svg"

import {
  usePermissionsContext,
  ENPermissionStatus,
} from "../PermissionsContext"
import { useSystemServicesContext } from "../SystemServicesContext"
import { ModalScreens, useStatusBarEffect, Stacks } from "../navigation"
import { useApplicationName } from "../hooks/useApplicationInfo"
import {
  StatusBar,
  GlobalText,
  Button,
  GradientBackground,
} from "../components"

import { BluetoothActivationStatus } from "./BluetoothActivationStatus"
import { ProximityTracingActivationStatus } from "./ProximityTracingActivationStatus"
import { LocationActivationStatus } from "./LocationActivationStatus"
import { ShareLink } from "./ShareLink"

import { Icons } from "../assets"
import {
  Layout,
  Spacing,
  Colors,
  Typography,
  Outlines,
  Iconography,
} from "../styles"

const TOP_ICON_SIZE = Iconography.medium

const Home: FunctionComponent = () => {
  useStatusBarEffect("light-content", Colors.gradient100Light)
  const { t } = useTranslation()
  const navigation = useNavigation()

  const { applicationName } = useApplicationName()

  const { isBluetoothOn, locationPermissions } = useSystemServicesContext()
  const isLocationRequiredAndOff = locationPermissions === "RequiredOff"
  const isLocationRequired = locationPermissions !== "NotRequired"

  const { exposureNotifications } = usePermissionsContext()
  const isProximityTracingOn =
    exposureNotifications.status === ENPermissionStatus.ENABLED

  const appIsActive =
    isProximityTracingOn && isBluetoothOn && !isLocationRequiredAndOff

  const handleOnPressSettings = () => {
    navigation.navigate(Stacks.Settings)
  }

  const handleOnPressReportTestResult = () => {
    navigation.navigate(Stacks.Modal, {
      screen: ModalScreens.AffectedUserStack,
    })
  }

  const topIcon = appIsActive ? Icons.CheckInCircle : Icons.XInCircle
  const topIconFill = appIsActive ? Colors.success100 : Colors.danger75
  const topIconAccessibilityLabel = appIsActive
    ? t("home.status_icon_active_label")
    : t("home.status_icon_inactive_label")
  const headerText = appIsActive
    ? t("home.bluetooth.tracing_on_header")
    : t("home.bluetooth.tracing_off_header")
  const subheaderText = () => {
    if (appIsActive) {
      return t("home.bluetooth.all_services_on_subheader", {
        applicationName,
      })
    } else {
      return isLocationRequired
        ? t("home.bluetooth.tracing_off_subheader_location")
        : t("home.bluetooth.tracing_off_subheader")
    }
  }

  const SettingsButton = () => {
    return (
      <TouchableOpacity
        style={style.settingsButtonContainer}
        accessible
        accessibilityLabel={t("home.open_settings")}
        onPress={handleOnPressSettings}
      >
        <SvgXml
          xml={Icons.Gear}
          width={Iconography.small}
          height={Iconography.small}
          fill={Colors.white}
        />
      </TouchableOpacity>
    )
  }

  return (
    <>
      <StatusBar backgroundColor={Colors.gradient100Light} />
      <ScrollView
        style={style.container}
        contentContainerStyle={style.contentContainer}
      >
        <View style={style.topScrollViewBackground} />
        <GradientBackground gradient={Colors.gradient100} angleCenterY={1}>
          <View style={style.topContainer}>
            <SettingsButton />
            <View style={style.topIconContainer}>
              <SvgXml
                xml={topIcon}
                width={TOP_ICON_SIZE}
                height={TOP_ICON_SIZE}
                fill={topIconFill}
                accessible
                style={style.topIcon}
                accessibilityLabel={topIconAccessibilityLabel}
              />
              {appIsActive && <ExpandingCircleAnimation />}
            </View>
            <GlobalText style={style.headerText} testID={"home-header"}>
              {headerText}
            </GlobalText>
            <GlobalText style={style.subheaderText} testID={"home-subheader"}>
              {subheaderText()}
            </GlobalText>
          </View>
        </GradientBackground>
        <View style={style.bottomContainer}>
          <View>
            <ShareLink />
            <BluetoothActivationStatus />
            <ProximityTracingActivationStatus />
            <LocationActivationStatus />
          </View>
          <View style={style.buttonContainer}>
            <Button
              onPress={handleOnPressReportTestResult}
              label={t("home.bluetooth.report_positive_result")}
              customButtonStyle={style.button}
              customButtonInnerStyle={style.buttonGradient}
              hasRightArrow
            />
          </View>
        </View>
      </ScrollView>
    </>
  )
}

const style = StyleSheet.create({
  topScrollViewBackground: {
    position: "absolute",
    top: "-100%",
    left: 0,
    right: 0,
    backgroundColor: Colors.gradient100Light,
    height: "100%",
  },
  container: {
    backgroundColor: Colors.primaryLightBackground,
  },
  contentContainer: {
    flexGrow: 1,
    paddingBottom: Spacing.small,
    backgroundColor: Colors.primaryLightBackground,
  },
  topContainer: {
    flexGrow: 1,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    paddingTop: Spacing.small,
    paddingBottom: Spacing.xLarge,
  },
  settingsButtonContainer: {
    position: "absolute",
    top: 0,
    right: 0,
    padding: Spacing.medium,
  },
  topIconContainer: {
    backgroundColor: Colors.white,
    borderRadius: Outlines.borderRadiusMax,
    padding: 5,
    marginBottom: Spacing.large,
  },
  topIcon: {
    zIndex: Layout.zLevel1,
  },
  headerText: {
    ...Typography.header2,
    ...Typography.mediumBold,
    color: Colors.white,
    textAlign: "center",
    marginBottom: Spacing.xxSmall,
  },
  subheaderText: {
    ...Typography.body1,
    fontSize: Typography.large,
    paddingHorizontal: Spacing.medium,
    color: Colors.white,
    textAlign: "center",
    marginBottom: Spacing.xxSmall,
  },
  bottomContainer: {
    justifyContent: "space-between",
    backgroundColor: Colors.primaryLightBackground,
  },
  buttonContainer: {
    marginTop: Spacing.medium,
    marginHorizontal: Spacing.small,
  },
  button: {
    width: "100%",
  },
  buttonGradient: {
    width: "100%",
    paddingTop: Spacing.xSmall,
    paddingBottom: Spacing.xSmall + 1,
  },
})

const ExpandingCircleAnimation: FunctionComponent = () => {
  const [isReduceMotionEnabled, setIsReduceMotionEnabled] = useState<boolean>(
    false,
  )

  const animationTime = 1200
  const delayTime = 2500
  const initialCircleSize = 0
  const endingCircleSize = 600
  const initialTopValue = TOP_ICON_SIZE / 2
  const endingTopValue = endingCircleSize * -0.42
  const initialOpacity = 0.05
  const endingOpacity = 0

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
        backgroundColor: Colors.white,
        opacity: opacityAnimatedValue,
        borderRadius: Outlines.borderRadiusMax,
      }}
    />
  )
}

export default Home
