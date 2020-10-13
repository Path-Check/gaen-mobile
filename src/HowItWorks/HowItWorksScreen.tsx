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
import { Text, Button } from "../components"
import { ModalStackScreens, useStatusBarEffect } from "../navigation"

import { Outlines, Colors, Spacing, Typography } from "../styles"

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
  useStatusBarEffect("dark-content", Colors.primaryLightBackground)
  const { t } = useTranslation()
  const navigation = useNavigation()
  const insets = useSafeAreaInsets()
  const style = createStyle(insets)

  const handleOnPressProtectPrivacy = () => {
    navigation.navigate(ModalStackScreens.ProtectPrivacy)
  }

  return (
    <>
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
          <Text style={style.headerText}>{howItWorksScreenContent.header}</Text>
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
    contentContainer: {
      flexGrow: 1,
      justifyContent: "space-between",
      paddingTop: headerHeight + Spacing.medium,
      paddingBottom: Spacing.xxLarge,
      backgroundColor: Colors.primaryLightBackground,
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
      marginBottom: Spacing.small,
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
      backgroundColor: Colors.primaryLightBackground,
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
