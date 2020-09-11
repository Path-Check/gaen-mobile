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
} from "react-native"
import { useNavigation } from "@react-navigation/native"
import { useTranslation } from "react-i18next"
import { SvgXml } from "react-native-svg"
import LinearGradient from "react-native-linear-gradient"
import { useSafeAreaInsets, EdgeInsets } from "react-native-safe-area-context"

import { StatusBar, GlobalText, Button } from "../components"
import {
  OnboardingScreens,
  ModalScreens,
  Stacks,
  useStatusBarEffect,
} from "../navigation"
import { getLocalNames } from "../locales/languages"

import { Images, Icons } from "../assets"
import {
  Layout,
  Outlines,
  Colors,
  Spacing,
  Typography,
  Iconography,
} from "../styles"
import { useOnboardingContext } from "../OnboardingContext"

type OnboardingScreenContent = {
  screenNumber: number
  image: ImageSourcePropType
  imageLabel: string
  header: string
  primaryButtonLabel: string
  primaryButtonOnPress: () => void
}

interface OnboardingScreenProps {
  onboardingScreenContent: OnboardingScreenContent
}

const OnboardingScreen: FunctionComponent<OnboardingScreenProps> = ({
  onboardingScreenContent: {
    screenNumber,
    image,
    imageLabel,
    header,
    primaryButtonLabel,
    primaryButtonOnPress,
  },
}: OnboardingScreenProps) => {
  useStatusBarEffect("dark-content", Colors.primaryLightBackground)
  const navigation = useNavigation()
  const { destinationAfterComplete } = useOnboardingContext()
  const {
    t,
    i18n: { language: localeCode },
  } = useTranslation()
  const languageName = getLocalNames()[localeCode]
  const insets = useSafeAreaInsets()
  const style = createStyle(insets)

  const handleOnPressSelectLanguage = () => {
    navigation.navigate(Stacks.Modal, {
      screen: ModalScreens.LanguageSelection,
    })
  }

  const handleOnPressProtectPrivacy = () => {
    navigation.navigate(Stacks.Modal, { screen: ModalScreens.ProtectPrivacy })
  }

  return (
    <>
      <StatusBar backgroundColor={Colors.primaryLightBackground} />
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
          onPress={() => navigation.navigate(destinationAfterComplete)}
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
              source={image}
              accessibilityLabel={imageLabel}
              accessible
              style={style.image}
              resizeMode={"contain"}
            />
            <PositionDots screenNumber={screenNumber} />
            <GlobalText style={style.headerText}>{header}</GlobalText>
          </View>
          <View style={style.nextButtonContainer}>
            <Button
              label={primaryButtonLabel}
              onPress={primaryButtonOnPress}
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
    </>
  )
}

const createStyle = (insets: EdgeInsets) => {
  const iosPaddingTop = 65
  const androidPaddingTop = 90
  const headerHeight = Platform.select({
    ios: iosPaddingTop,
    android: androidPaddingTop,
    default: iosPaddingTop,
  })

  /* eslint-disable react-native/no-unused-styles */
  return StyleSheet.create({
    header: {
      position: "absolute",
      width: "100%",
      zIndex: Layout.zLevel1,
      flexDirection: "row",
      alignItems: "flex-end",
      justifyContent: "space-between",
      paddingTop: insets.top,
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
      paddingTop: Spacing.small,
      paddingBottom: insets.bottom + Spacing.small,
    },
    bottomButtonText: {
      ...Typography.header5,
      color: Colors.primary100,
      marginRight: Spacing.xSmall,
    },
  })
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
      return dotsStyle.circleActive
    } else {
      return dotsStyle.circleInactive
    }
  }

  const screens = Array.from(Array(NUMBER_OF_ONBOARDING_SCREENS), (i) => i + 1)

  return (
    <View style={dotsStyle.circles}>
      {screens.map((_, idx) => {
        return <View style={determineCircleStyle(idx + 1)} key={idx} />
      })}
    </View>
  )
}
const dotsStyle = StyleSheet.create({
  circles: {
    flexDirection: "row",
    alignItems: "center",
    width: 150,
    justifyContent: "space-between",
    marginBottom: Spacing.medium,
    paddingHorizontal: Spacing.large,
  },
  circleActive: {
    backgroundColor: Colors.primary100,
    width: 10,
    height: 10,
    borderRadius: Outlines.borderRadiusMax,
  },
  circleInactive: {
    backgroundColor: Colors.neutral30,
    width: 5,
    height: 5,
    borderRadius: Outlines.borderRadiusMax,
  },
})

export default OnboardingScreen
