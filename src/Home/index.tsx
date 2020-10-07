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
  Linking,
  TouchableOpacity,
  StyleSheet,
  View,
} from "react-native"
import { useTranslation } from "react-i18next"
import { useNavigation } from "@react-navigation/native"
import { SvgXml } from "react-native-svg"

import {
  HomeStackScreens,
  ModalStackScreens,
  useStatusBarEffect,
  Stacks,
} from "../navigation"
import { useConfigurationContext } from "../ConfigurationContext"
import { StatusBar, Text, Button } from "../components"

import { BluetoothActivationStatus } from "./BluetoothActivationStatus"
import { ProximityTracingActivationStatus } from "./ProximityTracingActivationStatus"
import { LocationActivationStatus } from "./LocationActivationStatus"
import COVIDDataDashboard from "../COVIDDataDashboard/COVIDDataDashboard"
import { ShareLink } from "./ShareLink"
import { useExposureDetectionStatus } from "./useExposureDetectionStatus"

import { Icons } from "../assets"
import {
  Layout,
  Spacing,
  Colors,
  Typography,
  Outlines,
  Iconography,
  Buttons,
  Affordances,
} from "../styles"

const STATUS_ICON_SIZE = Iconography.small

const Home: FunctionComponent = () => {
  useStatusBarEffect("dark-content", Colors.primaryLightBackground)
  const { t } = useTranslation()
  const navigation = useNavigation()
  const { exposureDetectionStatus } = useExposureDetectionStatus()
  const {
    displaySelfAssessment,
    displayCovidData,
    displayCallbackForm,
    emergencyPhoneNumber,
  } = useConfigurationContext()

  const handleOnPressSettings = () => {
    navigation.navigate(Stacks.Settings)
  }

  const handleOnPressExposureDetectionStatus = () => {
    navigation.navigate(Stacks.Modal, {
      screen: HomeStackScreens.ExposureDetectionStatus,
    })
  }

  const handleOnPressTalkToContactTracer = () => {
    navigation.navigate(Stacks.Modal, {
      screen: ModalStackScreens.CallbackStack,
    })
  }

  const handleOnPressReportTestResult = () => {
    navigation.navigate(Stacks.Modal, {
      screen: HomeStackScreens.AffectedUserStack,
    })
  }

  const handleOnPressTakeSelfAssessment = () => {
    navigation.navigate(Stacks.Modal, {
      screen: ModalStackScreens.SelfScreenerFromHome,
    })
  }

  const handleOnPressCallEmergencyServices = () => {
    Linking.openURL(`tel:${emergencyPhoneNumber}`)
  }

  const statusBackgroundColor = exposureDetectionStatus
    ? Colors.success10
    : Colors.danger10
  const statusBorderColor = exposureDetectionStatus
    ? Colors.success100
    : Colors.danger100
  const statusIcon = exposureDetectionStatus
    ? Icons.CheckInCircle
    : Icons.XInCircle
  const statusIconFill = exposureDetectionStatus
    ? Colors.success100
    : Colors.danger100
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
    <>
      <StatusBar backgroundColor={Colors.primaryLightBackground} />
      <ScrollView
        style={style.container}
        contentContainerStyle={style.contentContainer}
      >
        <Text style={style.headerText}>{t("screen_titles.home")}</Text>
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
            fill={Colors.neutral100}
          />
        </TouchableOpacity>
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
              fill={Colors.black}
              width={Iconography.tiny}
              height={Iconography.tiny}
            />
          </View>
        </TouchableOpacity>
        <ShareLink />
        {displayCovidData && <COVIDDataDashboard />}
        {displayCallbackForm && (
          <View style={style.floatingContainer}>
            <Text style={style.sectionHeaderText}>
              {t("home.did_you_test_positive")}
            </Text>
            <Text style={style.sectionBodyText}>
              {t("home.to_submit_your_test")}
            </Text>
            <Button
              onPress={handleOnPressTalkToContactTracer}
              label={t("home.talk_to_a_contact")}
              customButtonStyle={style.button}
              customButtonInnerStyle={style.buttonInner}
              hasRightArrow
            />
          </View>
        )}
        <View style={style.floatingContainer}>
          <Text style={style.sectionHeaderText}>
            {t("home.have_a_positive_test")}
          </Text>
          <Text style={style.sectionBodyText}>
            {t("home.if_you_have_a_code")}
          </Text>
          <Button
            onPress={handleOnPressReportTestResult}
            label={t("home.submit_test_result_code")}
            customButtonStyle={style.button}
            customButtonInnerStyle={style.buttonInner}
            hasRightArrow
          />
        </View>
        {displaySelfAssessment && (
          <View style={style.floatingContainer}>
            <Text style={style.sectionHeaderText}>
              {t("home.feeling_sick")}
            </Text>
            <Text style={style.sectionBodyText}>
              {t("home.check_if_your_symptoms")}
            </Text>
            <Button
              onPress={handleOnPressTakeSelfAssessment}
              label={t("home.bluetooth.take_self_assessment")}
              customButtonStyle={style.button}
              customButtonInnerStyle={style.buttonInner}
            />
          </View>
        )}
        <TouchableOpacity
          onPress={handleOnPressCallEmergencyServices}
          accessibilityLabel={t(
            "self_screener.call_emergency_services.call_emergencies",
            {
              emergencyPhoneNumber,
            },
          )}
          accessibilityRole="button"
          style={style.emergencyButtonContainer}
        >
          <SvgXml
            xml={Icons.Phone}
            fill={Colors.white}
            width={Iconography.xSmall}
            height={Iconography.xSmall}
          />
          <Text style={style.emergencyButtonText}>
            {t("home.call_emergency_services", {
              emergencyPhoneNumber,
            })}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </>
  )
}

const style = StyleSheet.create({
  container: {
    backgroundColor: Colors.primaryLightBackground,
  },
  contentContainer: {
    paddingVertical: Spacing.medium,
    paddingHorizontal: Spacing.medium,
    backgroundColor: Colors.primaryLightBackground,
  },
  headerText: {
    ...Typography.header1,
    ...Typography.bold,
    marginBottom: Spacing.medium,
  },
  settingsButtonContainer: {
    position: "absolute",
    top: 0,
    right: 0,
    padding: Spacing.medium,
  },
  statusContainer: {
    ...Affordances.floatingContainer,
    paddingVertical: Spacing.small,
    elevation: 0,
    borderWidth: Outlines.hairline,
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
    ...Typography.header3,
    color: Colors.black,
  },
  statusBottomContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  statusActionText: {
    ...Typography.body2,
    color: Colors.black,
    marginRight: Spacing.xxxSmall,
    paddingBottom: 2,
  },
  floatingContainer: {
    ...Affordances.floatingContainer,
  },
  sectionHeaderText: {
    ...Typography.header3,
    marginBottom: Spacing.xxSmall,
  },
  sectionBodyText: {
    ...Typography.body1,
    marginBottom: Spacing.medium,
  },
  button: {
    width: "100%",
  },
  buttonInner: {
    ...Buttons.medium,
    width: "100%",
  },
  emergencyButtonContainer: {
    ...Buttons.primary,
    ...Buttons.medium,
    width: "100%",
    flexDirection: "row",
    alignSelf: "center",
    paddingHorizontal: Spacing.xLarge,
    borderRadius: Outlines.borderRadiusMax,
    backgroundColor: Colors.danger100,
  },
  emergencyButtonText: {
    ...Typography.buttonPrimary,
    marginLeft: Spacing.small,
  },
})

const ExpandingCircleAnimation: FunctionComponent = () => {
  const [isReduceMotionEnabled, setIsReduceMotionEnabled] = useState<boolean>(
    false,
  )

  const animationTime = 1600
  const delayTime = 800
  const initialCircleSize = 0
  const endingCircleSize = 600
  const initialTopValue = STATUS_ICON_SIZE / 2
  const endingTopValue = endingCircleSize * -0.46
  const initialOpacity = 0.3
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
        borderColor: Colors.success100,
        borderWidth: Outlines.hairline,
        borderRadius: Outlines.borderRadiusMax,
        opacity: opacityAnimatedValue,
      }}
    />
  )
}

export default Home
