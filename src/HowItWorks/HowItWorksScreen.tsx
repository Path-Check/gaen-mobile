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
import LinearGradient from "react-native-linear-gradient"
import { useSafeAreaInsets, EdgeInsets } from "react-native-safe-area-context"
import { StatusBar, GlobalText, Button } from "../components"
import { ModalScreens, Stacks, Stack, useStatusBarEffect } from "../navigation"
import { getLocalNames } from "../locales/languages"

import { Layout, Outlines, Colors, Spacing, Typography } from "../styles"

type HowItWorksScreenContent = {
  screenNumber: number
  image: ImageSourcePropType
  imageLabel: string
  header: string
  primaryButtonLabel: string
  primaryButtonOnPress: () => void
}

interface HowItWorksScreenProps {
  howItWorksScreenContent: HowItWorksScreenContent
  totalScreenCount: number
  destinationOnSkip: Stack
}

const HowItWorksScreen: FunctionComponent<HowItWorksScreenProps> = ({
  howItWorksScreenContent,
  totalScreenCount,
  destinationOnSkip,
}) => {
  useStatusBarEffect("dark-content", Colors.primaryLightBackground)
  const navigation = useNavigation()
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

  const handleOnPressSkip = () => {
    navigation.navigate(destinationOnSkip)
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
            colors={Colors.gradient10}
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
        <TouchableOpacity onPress={handleOnPressSkip}>
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
              source={howItWorksScreenContent.image}
              accessibilityLabel={howItWorksScreenContent.imageLabel}
              accessible
              style={style.image}
              resizeMode={"contain"}
            />
            <PositionDots
              highlightedDotIdx={howItWorksScreenContent.screenNumber}
              totalDotCount={totalScreenCount}
            />
            <GlobalText style={style.headerText}>
              {howItWorksScreenContent.header}
            </GlobalText>
          </View>
        </ScrollView>
        <View style={style.bottomButtonContainer}>
          <>
            <Button
              customButtonStyle={style.nextButton}
              customButtonInnerStyle={style.nextButtonGradient}
              label={howItWorksScreenContent.primaryButtonLabel}
              onPress={howItWorksScreenContent.primaryButtonOnPress}
              hasRightArrow
            />
            <TouchableOpacity onPress={handleOnPressProtectPrivacy}>
              <GlobalText style={style.bottomButtonText}>
                {t("onboarding.protect_privacy_button")}
              </GlobalText>
            </TouchableOpacity>
          </>
        </View>
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
      ...Typography.header2,
      marginBottom: Spacing.xLarge,
      paddingHorizontal: Spacing.large,
    },
    nextButton: {
      width: "95%",
      alignSelf: "center",
      marginBottom: Spacing.xxSmall,
    },
    nextButtonGradient: {
      paddingTop: Spacing.xSmall,
      paddingBottom: Spacing.xSmall + 1,
      width: "95%",
      alignSelf: "center",
    },
    bottomButtonContainer: {
      alignItems: "center",
      paddingTop: Spacing.small,
      paddingBottom: insets.bottom + Spacing.small,
    },
    bottomButtonText: {
      ...Typography.header5,
      color: Colors.primary100,
    },
  })
}

interface PositionDotsProps {
  highlightedDotIdx: number
  totalDotCount: number
}

const PositionDots: FunctionComponent<PositionDotsProps> = ({
  highlightedDotIdx,
  totalDotCount,
}) => {
  const determineDotStyle = (dotPosition: number): ViewStyle => {
    if (dotPosition === highlightedDotIdx) {
      return dotsStyle.dotHighlighted
    } else {
      return dotsStyle.dot
    }
  }

  const screens = Array.from(Array(totalDotCount), (i) => i + 1)

  return (
    <View style={dotsStyle.dotsContainer}>
      {screens.map((_, idx) => {
        return <View style={determineDotStyle(idx + 1)} key={idx} />
      })}
    </View>
  )
}
const dotsStyle = StyleSheet.create({
  dotsContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: 150,
    justifyContent: "space-between",
    marginBottom: Spacing.medium,
    paddingHorizontal: Spacing.large,
  },
  dotHighlighted: {
    backgroundColor: Colors.primary100,
    width: 10,
    height: 10,
    borderRadius: Outlines.borderRadiusMax,
  },
  dot: {
    backgroundColor: Colors.neutral30,
    width: 5,
    height: 5,
    borderRadius: Outlines.borderRadiusMax,
  },
})

const MemoizedHowItWorksScreen = React.memo(HowItWorksScreen)

export default MemoizedHowItWorksScreen
