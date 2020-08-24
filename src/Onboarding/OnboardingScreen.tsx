import React, { FunctionComponent } from "react"
import {
  Image,
  StyleSheet,
  Platform,
  View,
  ScrollView,
  ImageSourcePropType,
  ViewStyle,
  TouchableOpacity,
  SafeAreaView,
} from "react-native"
import { useNavigation } from "@react-navigation/native"
import { useTranslation } from "react-i18next"
import { SvgXml } from "react-native-svg"
import LinearGradient from "react-native-linear-gradient"

import { Button } from "../components/Button"
import { GlobalText } from "../components/GlobalText"
import {
  Screens,
  OnboardingScreens,
  Stacks,
  ActivationScreens,
  useStatusBarEffect,
} from "../navigation"
import { getLocalNames } from "../locales/languages"

import { Icons } from "../assets"
import {
  Layout,
  Outlines,
  Colors,
  Spacing,
  Typography,
  Iconography,
} from "../styles"

type OnboardingScreenContent = {
  screenNumber: number
  image: ImageSourcePropType
  imageLabel: string
  header: string
  primaryButtonLabel: string
}

type OnboardingScreenActions = {
  primaryButtonOnPress: () => void
}

interface OnboardingScreenProps {
  onboardingScreenContent: OnboardingScreenContent
  onboardingScreenActions: OnboardingScreenActions
}

const OnboardingScreen: FunctionComponent<OnboardingScreenProps> = ({
  onboardingScreenContent,
  onboardingScreenActions,
}: OnboardingScreenProps) => {
  const navigation = useNavigation()
  const {
    t,
    i18n: { language: localeCode },
  } = useTranslation()
  const languageName = getLocalNames()[localeCode]
  useStatusBarEffect("dark-content")

  const handleOnPressSelectLanguage = () => {
    navigation.navigate(Screens.LanguageSelection)
  }

  const handleOnPressProtectPrivacy = () => {
    navigation.navigate(OnboardingScreens.ProtectPrivacy)
  }

  return (
    <>
      <SafeAreaView style={style.topSafeArea} />
      <SafeAreaView style={style.bottomSafeArea}>
        <View style={style.header}>
          <TouchableOpacity onPress={handleOnPressSelectLanguage}>
            <LinearGradient
              colors={Colors.gradientPrimary10}
              useAngle
              angle={0}
              angleCenter={{ x: 0.5, y: 0.5 }}
              style={style.languageButtonContainer}
            >
              <GlobalText style={style.languageButtonText}>
                {languageName}
              </GlobalText>
            </LinearGradient>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() =>
              navigation.navigate(Stacks.Activation, {
                screen: ActivationScreens.AcceptEula,
              })
            }
          >
            <GlobalText style={style.skipButtonText}>
              {t("common.skip")}
            </GlobalText>
          </TouchableOpacity>
        </View>
        <View style={style.outerContainer}>
          <ScrollView
            alwaysBounceVertical={false}
            contentContainerStyle={style.contentContainer}
          >
            <View>
              <Image
                source={onboardingScreenContent.image}
                accessibilityLabel={onboardingScreenContent.imageLabel}
                accessible
                style={style.image}
                resizeMode={"contain"}
              />
              <PositionDots
                screenNumber={onboardingScreenContent.screenNumber}
              />
              <GlobalText style={style.headerText}>
                {onboardingScreenContent.header}
              </GlobalText>
            </View>
            <View style={style.nextButtonContainer}>
              <Button
                label={onboardingScreenContent.primaryButtonLabel}
                onPress={onboardingScreenActions.primaryButtonOnPress}
                hasRightArrow
              />
            </View>
          </ScrollView>
          <TouchableOpacity
            style={style.bottomButtonContainer}
            onPress={handleOnPressProtectPrivacy}
          >
            <GlobalText style={style.bottomButtonText}>
              {t("onboarding.protect_privacy_button")}
            </GlobalText>
            <SvgXml
              xml={Icons.ChevronUp}
              fill={Colors.primary100}
              width={Iconography.xxSmall}
              height={Iconography.xxSmall}
            />
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </>
  )
}

interface PositionDotsProps {
  screenNumber: number
}

const NUMBER_OF_ONBOARDING_SCREENS = 5

const PositionDots: FunctionComponent<PositionDotsProps> = ({
  screenNumber,
}) => {
  const determineCircleStyle = (circlePosition: number): ViewStyle => {
    if (circlePosition === screenNumber) {
      return style.circleActive
    } else {
      return style.circleInactive
    }
  }

  const screens = Array.from(Array(NUMBER_OF_ONBOARDING_SCREENS), (i) => i + 1)

  return (
    <View style={style.circles}>
      {screens.map((_, idx) => {
        return <View style={determineCircleStyle(idx + 1)} key={idx} />
      })}
    </View>
  )
}

const iosHeaderHeight = 65
const androidHeaderHeight = 90
const headerHeight = Platform.select({
  ios: iosHeaderHeight,
  android: androidHeaderHeight,
  default: iosHeaderHeight,
})

const style = StyleSheet.create({
  topSafeArea: {
    backgroundColor: Colors.primaryLightBackground,
  },
  bottomSafeArea: {
    flex: 1,
    backgroundColor: Colors.secondary10,
  },
  header: {
    position: "absolute",
    top: 0,
    height: headerHeight,
    width: "100%",
    zIndex: Layout.zLevel1,
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    paddingHorizontal: Spacing.xSmall,
    backgroundColor: Colors.primaryLightBackground,
    borderBottomColor: Colors.neutral10,
    borderBottomWidth: Outlines.hairline,
  },
  languageButtonContainer: {
    borderRadius: Outlines.borderRadiusMax,
    paddingVertical: Spacing.xxSmall,
    paddingHorizontal: Spacing.xLarge,
    marginBottom: Spacing.xSmall,
  },
  languageButtonText: {
    ...Typography.body3,
    letterSpacing: Typography.largeLetterSpacing,
    color: Colors.primary125,
    textAlign: "center",
    textTransform: "uppercase",
  },
  skipButtonText: {
    ...Typography.body2,
    color: Colors.neutral100,
    padding: Spacing.medium,
  },
  outerContainer: {
    justifyContent: "space-between",
    flex: 1,
    backgroundColor: Colors.primaryLightBackground,
  },
  contentContainer: {
    flexGrow: 1,
    justifyContent: "space-between",
    paddingTop: headerHeight + Spacing.medium,
    paddingBottom: Spacing.xxLarge,
  },
  image: {
    width: "97%",
    height: 220,
    marginBottom: Spacing.medium,
  },
  circleActive: {
    backgroundColor: Colors.primary100,
    width: 10,
    height: 10,
    borderRadius: Outlines.borderRadiusMax,
  },
  circles: {
    flexDirection: "row",
    alignItems: "center",
    width: 150,
    justifyContent: "space-between",
    marginBottom: Spacing.medium,
    paddingHorizontal: Spacing.large,
  },
  circleInactive: {
    backgroundColor: Colors.neutral30,
    width: 5,
    height: 5,
    borderRadius: Outlines.borderRadiusMax,
  },
  headerText: {
    ...Typography.header1,
    marginBottom: Spacing.xLarge,
    paddingHorizontal: Spacing.large,
  },
  nextButtonContainer: {
    alignSelf: "flex-start",
    paddingHorizontal: Spacing.large,
  },
  bottomButtonContainer: {
    backgroundColor: Colors.secondary10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: Spacing.small,
  },
  bottomButtonText: {
    ...Typography.header5,
    color: Colors.primary100,
    marginRight: Spacing.xSmall,
  },
})

export default OnboardingScreen
