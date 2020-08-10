import React, { FunctionComponent } from "react"
import {
  Image,
  StyleSheet,
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

import { Button } from "../components/Button"
import { GlobalText } from "../components/GlobalText"
import {
  OnboardingScreens,
  Stacks,
  ActivationScreens,
  useStatusBarEffect,
} from "../navigation"
import { NUMBER_OF_ONBOARDING_SCREENS } from "../navigation/OnboardingStack"

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
  const { t } = useTranslation()
  const navigation = useNavigation()

  useStatusBarEffect("dark-content")

  return (
    <SafeAreaView>
      <View>
        <TouchableOpacity
          onPress={() =>
            navigation.navigate(Stacks.Activation, {
              screen: ActivationScreens.AcceptEula,
            })
          }
          style={style.skipButtonContainer}
        >
          <GlobalText style={style.skipButtonText}>
            {t("common.skip")}
          </GlobalText>
        </TouchableOpacity>
        <View style={style.outerContainer}>
          <ScrollView
            alwaysBounceVertical={false}
            style={style.container}
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
            <Button
              hasRightArrow
              label={onboardingScreenContent.primaryButtonLabel}
              onPress={onboardingScreenActions.primaryButtonOnPress}
            />
          </ScrollView>
          <TouchableOpacity
            style={style.bottomButtonContainer}
            onPress={() =>
              navigation.navigate(OnboardingScreens.ProtectPrivacy)
            }
          >
            <SvgXml
              xml={Icons.ChevronUp}
              fill={Colors.primaryBlue}
              width={Iconography.xSmall}
              height={Iconography.xSmall}
            />
            <GlobalText style={style.bottomButtonText}>
              {t("onboarding.protect_privacy")}
            </GlobalText>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  )
}

interface PositionDotsProps {
  screenNumber: number
}

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

const style = StyleSheet.create({
  outerContainer: {
    justifyContent: "space-between",
    height: "100%",
  },
  container: {
    paddingHorizontal: Spacing.large,
  },
  contentContainer: {
    paddingBottom: Spacing.large,
  },

  image: {
    width: "100%",
    height: 300,
    marginTop: Spacing.small,
    marginBottom: Spacing.medium,
  },
  circleActive: {
    backgroundColor: Colors.primaryBlue,
    width: 10,
    height: 10,
    borderRadius: Outlines.borderRadiusMax,
  },
  circles: {
    flexDirection: "row",
    alignItems: "center",
    width: 100,
    justifyContent: "space-between",
    marginBottom: Spacing.medium,
  },
  circleInactive: {
    backgroundColor: Colors.lighterGray,
    width: 5,
    height: 5,
    borderRadius: Outlines.borderRadiusMax,
  },
  headerText: {
    ...Typography.header3,
    marginBottom: Spacing.xxxLarge,
  },
  skipButtonContainer: {
    position: "absolute",
    top: Spacing.small,
    right: Spacing.small,
    padding: Spacing.small,
    zIndex: Layout.zLevel1,
  },
  skipButtonText: {
    ...Typography.base,
    color: Colors.mediumGray,
  },
  bottomButtonContainer: {
    alignItems: "center",
  },
  bottomButtonText: {
    ...Typography.header5,
    color: Colors.primaryBlue,
    marginTop: Spacing.xxSmall,
  },
})
export default OnboardingScreen
