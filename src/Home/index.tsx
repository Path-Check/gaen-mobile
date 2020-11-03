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

import SectionButton from "./SectionButton"
import ShareLink from "./ShareLink"
import CovidDataCard from "../CovidData/Card"
import { useExposureDetectionStatus } from "../Device/useExposureDetectionStatus"

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
        <SectionButton text={t("home.request_call")} />
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
        <SectionButton text={t("home.report_result")} />
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
        <Image
          source={Images.SelfAssessment}
          style={style.image}
          width={150}
          height={IMAGE_HEIGHT}
        />
        <Text style={style.sectionHeaderText}>
          {t("home.not_feeling_well")}
        </Text>
        <Text style={style.sectionBodyText}>
          {t("home.check_if_your_symptoms")}
        </Text>
        <SectionButton text={t("home.take_assessment")} />
      </TouchableOpacity>
    )
  }

  const CallEmergencyServices: FunctionComponent = () => {
    const handleOnPressCallEmergencyServices = () => {
      Linking.openURL(`tel:${emergencyPhoneNumber}`)
    }

    return (
      <View style={style.emergencyButtonOuterContainer}>
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
      </View>
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
        {displayCovidData && <CovidDataCard />}
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
    ...Typography.header.x60,
    ...Typography.style.bold,
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
  floatingContainer: {
    ...Affordances.floatingContainer,
  },
  image: {
    resizeMode: "contain",
    marginBottom: Spacing.small,
  },
  sectionHeaderText: {
    ...Typography.header.x40,
    color: Colors.neutral.black,
    marginBottom: Spacing.xSmall,
  },
  sectionBodyText: {
    ...Typography.header.x20,
    ...Typography.style.normal,
    lineHeight: Typography.lineHeight.x40,
    color: Colors.neutral.shade100,
    marginBottom: Spacing.xLarge,
  },
  emergencyButtonOuterContainer: {
    borderTopWidth: Outlines.hairline,
    borderColor: Colors.neutral.shade25,

    paddingTop: Spacing.large,
  },
  emergencyButtonContainer: {
    ...Buttons.thin.base,
    borderRadius: Outlines.borderRadiusLarge,
    backgroundColor: Colors.accent.danger100,
  },
  emergencyButtonText: {
    ...Typography.button.primary,
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
