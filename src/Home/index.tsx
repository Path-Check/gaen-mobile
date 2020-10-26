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
  Image,
} from "react-native"
import { useTranslation } from "react-i18next"
import { useNavigation } from "@react-navigation/native"
import { SvgXml } from "react-native-svg"

import {
  HomeStackScreens,
  ModalStackScreens,
  useStatusBarEffect,
} from "../navigation"
import { useConfigurationContext } from "../ConfigurationContext"
import { StatusBar, Text } from "../components"

import ShareLink from "./ShareLink"
import CovidDataClip from "../CovidDataDashboard/CovidDataClip"
import { useExposureDetectionStatus } from "./useExposureDetectionStatus"

import { Icons, Images } from "../assets"
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
const IMAGE_HEIGHT = 170

const Home: FunctionComponent = () => {
  useStatusBarEffect("dark-content", Colors.background.primaryLight)
  const { t } = useTranslation()
  const navigation = useNavigation()
  const { exposureDetectionStatus } = useExposureDetectionStatus()
  const {
    displaySelfAssessment,
    displayCovidData,
    displayCallbackForm,
    emergencyPhoneNumber,
  } = useConfigurationContext()

  const ChevronRightIcon = () => {
    return (
      <View style={style.chevronRightIcon}>
        <SvgXml
          xml={Icons.ChevronRight}
          width={Iconography.xxSmall}
          height={Iconography.xxSmall}
          fill={Colors.neutral.shade75}
        />
      </View>
    )
  }

  const ExposureDetectionStatus: FunctionComponent = () => {
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
  const TalkToContactTracer: FunctionComponent = () => {
    const handleOnPressTalkToContactTracer = () => {
      navigation.navigate(ModalStackScreens.CallbackStack)
    }

    return (
      <TouchableOpacity
        onPress={handleOnPressTalkToContactTracer}
        style={style.floatingContainer}
      >
        <ChevronRightIcon />
        <Image
          source={Images.HowItWorksValueProposition}
          style={style.image}
          width={200}
          height={IMAGE_HEIGHT}
        />
        <Text style={style.sectionHeaderText}>
          {t("home.did_you_test_positive")}
        </Text>
        <Text style={style.sectionBodyText}>
          {t("home.to_submit_your_test")}
        </Text>
      </TouchableOpacity>
    )
  }

  const ReportTestResult: FunctionComponent = () => {
    const handleOnPressReportTestResult = () => {
      navigation.navigate(HomeStackScreens.AffectedUserStack)
    }

    return (
      <TouchableOpacity
        onPress={handleOnPressReportTestResult}
        style={style.floatingContainer}
      >
        <ChevronRightIcon />
        <Image
          source={Images.ProtectPrivacySubmitKeys}
          style={style.image}
          width={130}
          height={IMAGE_HEIGHT}
        />
        <Text style={style.sectionHeaderText}>
          {t("home.have_a_positive_test")}
        </Text>
        <Text style={style.sectionBodyText}>
          {t("home.if_you_have_a_code")}
        </Text>
      </TouchableOpacity>
    )
  }

  const SelfAssessment: FunctionComponent = () => {
    const handleOnPressTakeSelfAssessment = () => {
      navigation.navigate(ModalStackScreens.SelfAssessmentFromHome)
    }

    return (
      <TouchableOpacity
        onPress={handleOnPressTakeSelfAssessment}
        style={style.floatingContainer}
      >
        <ChevronRightIcon />
        <Image
          source={Images.SelfAssessment}
          style={style.image}
          width={150}
          height={IMAGE_HEIGHT}
        />
        <Text style={style.sectionHeaderText}>{t("home.feeling_sick")}</Text>
        <Text style={style.sectionBodyText}>
          {t("home.check_if_your_symptoms")}
        </Text>
      </TouchableOpacity>
    )
  }

  const CallEmergencyServices: FunctionComponent = () => {
    const handleOnPressCallEmergencyServices = () => {
      Linking.openURL(`tel:${emergencyPhoneNumber}`)
    }

    return (
      <TouchableOpacity
        onPress={handleOnPressCallEmergencyServices}
        accessibilityLabel={t(
          "self_assessment.call_emergency_services.call_emergencies",
          {
            emergencyPhoneNumber,
          },
        )}
        accessibilityRole="button"
        style={style.emergencyButtonContainer}
      >
        <SvgXml
          xml={Icons.Phone}
          fill={Colors.neutral.white}
          width={Iconography.xSmall}
          height={Iconography.xSmall}
        />
        <Text style={style.emergencyButtonText}>
          {t("home.call_emergency_services", {
            emergencyPhoneNumber,
          })}
        </Text>
      </TouchableOpacity>
    )
  }

  return (
    <>
      <StatusBar backgroundColor={Colors.background.primaryLight} />
      <ScrollView
        style={style.container}
        contentContainerStyle={style.contentContainer}
      >
        <Text style={style.headerText}>{t("screen_titles.home")}</Text>
        <ExposureDetectionStatus />
        <ShareLink />
        {displayCovidData && <CovidDataClip />}
        {displayCallbackForm && <TalkToContactTracer />}
        <ReportTestResult />
        {displaySelfAssessment && <SelfAssessment />}
        <CallEmergencyServices />
      </ScrollView>
    </>
  )
}

const style = StyleSheet.create({
  container: {
    backgroundColor: Colors.background.primaryLight,
  },
  contentContainer: {
    paddingTop: Spacing.medium,
    paddingBottom: Spacing.xxxLarge,
    paddingHorizontal: Spacing.medium,
    backgroundColor: Colors.background.primaryLight,
  },
  headerText: {
    ...Typography.header1,
    ...Typography.bold,
    marginBottom: Spacing.medium,
  },
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
    ...Typography.header3,
    color: Colors.neutral.black,
  },
  statusBottomContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  statusActionText: {
    ...Typography.body2,
    color: Colors.neutral.black,
    marginRight: Spacing.xxxSmall,
    paddingBottom: 2,
  },
  floatingContainer: {
    ...Affordances.floatingContainer,
  },
  chevronRightIcon: {
    position: "absolute",
    top: Spacing.large,
    right: Spacing.large,
  },
  image: {
    resizeMode: "contain",
    marginBottom: Spacing.xSmall,
  },
  sectionHeaderText: {
    ...Typography.header3,
    marginBottom: Spacing.xxSmall,
    color: Colors.neutral.black,
  },
  sectionBodyText: {
    ...Typography.header4,
    ...Typography.base,
    color: Colors.neutral.shade100,
    marginBottom: Spacing.small,
  },
  emergencyButtonContainer: {
    ...Buttons.primary,
    ...Buttons.medium,
    borderRadius: Outlines.borderRadiusLarge,
    width: "100%",
    flexDirection: "row",
    alignSelf: "center",
    paddingHorizontal: Spacing.xLarge,
    backgroundColor: Colors.accent.danger100,
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

export default Home
