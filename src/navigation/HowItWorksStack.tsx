import React, { FunctionComponent } from "react"
import {
  ImageSourcePropType,
  StyleSheet,
  Text,
  TouchableOpacity,
} from "react-native"
import { useTranslation } from "react-i18next"
import { useNavigation } from "@react-navigation/native"
import {
  createStackNavigator,
  HeaderStyleInterpolators,
} from "@react-navigation/stack"
import LinearGradient from "react-native-linear-gradient"

import {
  HowItWorksStackScreen,
  HowItWorksStackScreens,
  ModalStackScreens,
  Stack as StackType,
} from "../navigation/index"
import HowItWorksScreen from "../HowItWorks/HowItWorksScreen"
import { getLocalNames } from "../locales/languages"

import { Images } from "../assets"
import { Colors, Outlines, Spacing, Typography } from "../styles"

const Stack = createStackNavigator()

interface HowItWorksStackProps {
  destinationOnSkip: StackType
}

type HowItWorksScreenDatum = {
  name: HowItWorksStackScreen
  image: ImageSourcePropType
  imageLabel: string
  header: string
  primaryButtonLabel: string
  primaryButtonOnPress: () => void
}

const HowItWorksStack: FunctionComponent<HowItWorksStackProps> = ({
  destinationOnSkip,
}) => {
  const {
    t,
    i18n: { language: localeCode },
  } = useTranslation()
  const navigation = useNavigation()
  const languageName = getLocalNames()[localeCode]

  const handleOnPressSelectLanguage = () => {
    navigation.navigate(ModalStackScreens.LanguageSelection)
  }

  const handleOnPressSkip = () => {
    navigation.navigate(destinationOnSkip)
  }

  const introduction: HowItWorksScreenDatum = {
    name: HowItWorksStackScreens.Introduction,
    image: Images.HowItWorksIntroduction,
    imageLabel: t("onboarding.screen1_image_label"),
    header: t("onboarding.screen1_header"),
    primaryButtonLabel: t("onboarding.screen1_button"),
    primaryButtonOnPress: () =>
      navigation.navigate(HowItWorksStackScreens.PhoneRemembersDevices),
  }
  const phoneRemembersDevices: HowItWorksScreenDatum = {
    name: HowItWorksStackScreens.PhoneRemembersDevices,
    image: Images.HowItWorksPhoneRemembersDevice,
    imageLabel: t("onboarding.screen2_image_label"),
    header: t("onboarding.screen2_header"),
    primaryButtonLabel: t("onboarding.screen2_button"),
    primaryButtonOnPress: () =>
      navigation.navigate(HowItWorksStackScreens.PersonalPrivacy),
  }
  const personalPrivacy: HowItWorksScreenDatum = {
    name: HowItWorksStackScreens.PersonalPrivacy,
    image: Images.HowItWorksPersonalPrivacy,
    imageLabel: t("onboarding.screen3_image_label"),
    header: t("onboarding.screen3_header"),
    primaryButtonLabel: t("onboarding.screen3_button"),
    primaryButtonOnPress: () =>
      navigation.navigate(HowItWorksStackScreens.GetNotified),
  }
  const getNotified: HowItWorksScreenDatum = {
    name: HowItWorksStackScreens.GetNotified,
    image: Images.HowItWorksGetNotified,
    imageLabel: t("onboarding.screen4_image_label"),
    header: t("onboarding.screen4_header"),
    primaryButtonLabel: t("onboarding.screen4_button"),
    primaryButtonOnPress: () =>
      navigation.navigate(HowItWorksStackScreens.ValueProposition),
  }
  const valueProposition: HowItWorksScreenDatum = {
    name: HowItWorksStackScreens.ValueProposition,
    image: Images.HowItWorksValueProposition,
    imageLabel: t("onboarding.screen5_image_label"),
    header: t("onboarding.screen5_header"),
    primaryButtonLabel: t("onboarding.screen_5_button"),
    primaryButtonOnPress: () => {
      navigation.navigate(destinationOnSkip)
    },
  }

  const howItWorksScreenData: HowItWorksScreenDatum[] = [
    introduction,
    phoneRemembersDevices,
    personalPrivacy,
    getNotified,
    valueProposition,
  ]

  const toStackScreen = (datum: HowItWorksScreenDatum, idx: number) => {
    const screenNumber = idx + 1
    const howItWorksScreenDisplayDatum = {
      screenNumber,
      ...datum,
    }

    return (
      <Stack.Screen
        key={howItWorksScreenDisplayDatum.header}
        name={howItWorksScreenDisplayDatum.name}
      >
        {(props) => (
          <HowItWorksScreen
            {...props}
            howItWorksScreenContent={howItWorksScreenDisplayDatum}
            totalScreenCount={howItWorksScreenData.length}
          />
        )}
      </Stack.Screen>
    )
  }

  const headerLeft = () => <HeaderLeft />
  const HeaderLeft = () => {
    return (
      <TouchableOpacity onPress={handleOnPressSelectLanguage}>
        <LinearGradient
          colors={Colors.gradient10}
          useAngle
          angle={0}
          angleCenter={{ x: 0.5, y: 0.5 }}
          style={style.languageButtonContainer}
        >
          <Text style={style.languageButtonText}>{languageName}</Text>
        </LinearGradient>
      </TouchableOpacity>
    )
  }

  const headerRight = () => <HeaderRight />
  const HeaderRight = () => {
    return (
      <TouchableOpacity
        onPress={handleOnPressSkip}
        style={style.skipButtonContainer}
      >
        <Text style={style.skipButtonText}>{t("common.skip")}</Text>
      </TouchableOpacity>
    )
  }

  return (
    <Stack.Navigator
      screenOptions={{
        title: "",
        headerLeft: headerLeft,
        headerRight: headerRight,
        headerStyleInterpolator: HeaderStyleInterpolators.forNoAnimation,
      }}
    >
      {howItWorksScreenData.map((data, idx) => toStackScreen(data, idx))}
    </Stack.Navigator>
  )
}

const style = StyleSheet.create({
  languageButtonContainer: {
    borderRadius: Outlines.borderRadiusMax,
    paddingVertical: Spacing.xxSmall,
    paddingHorizontal: Spacing.xLarge,
    marginBottom: Spacing.xSmall,
    marginLeft: Spacing.small,
  },
  languageButtonText: {
    ...Typography.body3,
    letterSpacing: Typography.largeLetterSpacing,
    color: Colors.primary125,
    textAlign: "center",
    textTransform: "uppercase",
  },
  skipButtonContainer: {
    justifyContent: "center",
    alignItems: "center",
    marginRight: Spacing.small,
    padding: Spacing.xSmall,
  },
  skipButtonText: {
    ...Typography.body2,
    color: Colors.neutral100,
  },
})

const MemoizedHowItWorksStack = React.memo(HowItWorksStack)

export default MemoizedHowItWorksStack
