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
import { useSafeAreaInsets, EdgeInsets } from "react-native-safe-area-context"
import { SvgXml } from "react-native-svg"

import { ModalStackScreens, useStatusBarEffect } from "../navigation"
import { Text } from "../components"

import { Outlines, Colors, Spacing, Typography, Buttons } from "../styles"
import { Icons } from "../assets"

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
}

const HowItWorksScreen: FunctionComponent<HowItWorksScreenProps> = ({
  howItWorksScreenContent,
  totalScreenCount,
}) => {
  useStatusBarEffect("dark-content", Colors.background.primaryLight)
  const { t } = useTranslation()
  const navigation = useNavigation()
  const insets = useSafeAreaInsets()
  const style = createStyle(insets)

  const handleOnPressProtectPrivacy = () => {
    navigation.navigate(ModalStackScreens.ProtectPrivacy)
  }

  const {
    screenNumber,
    image,
    imageLabel,
    header,
    primaryButtonLabel,
    primaryButtonOnPress,
  } = howItWorksScreenContent

  return (
    <>
      <ScrollView
        style={style.container}
        contentContainerStyle={style.contentContainer}
        alwaysBounceVertical={false}
      >
        <View>
          <Image
            source={image}
            accessibilityLabel={imageLabel}
            accessible
            style={style.image}
            resizeMode={"contain"}
          />
          <PositionDots
            highlightedDotIdx={screenNumber}
            totalDotCount={totalScreenCount}
          />
          <Text style={style.headerText}>{header}</Text>
        </View>
      </ScrollView>
      <View style={style.bottomButtonContainer}>
        <>
          <TouchableOpacity
            style={style.button}
            onPress={primaryButtonOnPress}
            accessibilityLabel={primaryButtonLabel}
          >
            <Text style={style.buttonText}>{primaryButtonLabel}</Text>
            <SvgXml xml={Icons.Arrow} fill={Colors.background.primaryLight} />
          </TouchableOpacity>
          <TouchableOpacity onPress={handleOnPressProtectPrivacy}>
            <Text style={style.bottomButtonText}>
              {t("onboarding.protect_privacy_button")}
            </Text>
          </TouchableOpacity>
        </>
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
    container: {
      backgroundColor: Colors.background.primaryLight,
    },
    contentContainer: {
      flexGrow: 1,
      justifyContent: "space-between",
      paddingTop: headerHeight + Spacing.medium,
      paddingBottom: Spacing.xxLarge,
      backgroundColor: Colors.background.primaryLight,
    },
    image: {
      width: "97%",
      height: 220,
      marginBottom: Spacing.medium,
    },
    headerText: {
      ...Typography.header.x50,
      marginBottom: Spacing.xLarge,
      paddingHorizontal: Spacing.large,
    },
    button: {
      ...Buttons.thin.base,
      marginBottom: Spacing.small,
    },
    buttonText: {
      ...Typography.button.primary,
      marginRight: Spacing.small,
    },
    bottomButtonContainer: {
      alignItems: "center",
      paddingTop: Spacing.small,
      paddingBottom: insets.bottom + Spacing.small,
      backgroundColor: Colors.background.primaryLight,
    },
    bottomButtonText: {
      ...Typography.header.x20,
      color: Colors.primary.shade100,
      paddingHorizontal: Spacing.large,
      textAlign: "center",
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
    backgroundColor: Colors.primary.shade100,
    width: 10,
    height: 10,
    borderRadius: Outlines.borderRadiusMax,
  },
  dot: {
    backgroundColor: Colors.neutral.shade30,
    width: 5,
    height: 5,
    borderRadius: Outlines.borderRadiusMax,
  },
})

const MemoizedHowItWorksScreen = React.memo(HowItWorksScreen)

export default MemoizedHowItWorksScreen
