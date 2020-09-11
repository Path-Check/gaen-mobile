import React, { FunctionComponent } from "react"
import {
  createStackNavigator,
  StackNavigationOptions,
} from "@react-navigation/stack"
import { useNavigation } from "@react-navigation/native"
import { ImageSourcePropType } from "react-native"
import { useTranslation } from "react-i18next"

import {
  OnboardingScreen as Screen,
  OnboardingScreens as Screens,
  Stack as DestinationStack,
} from "./index"
import Welcome from "../Onboarding/Welcome"
import Onboarding from "../Onboarding/OnboardingScreen"

import { Images } from "../assets"

type OnboardingStackParams = {
  [key in Screen]: undefined
}

type OnboardingScreen = {
  name: Screen
  screenNumber: number
  image: ImageSourcePropType
  imageLabel: string
  header: string
  primaryButtonLabel: string
  primaryButtonOnPress: () => void
}

const Stack = createStackNavigator<OnboardingStackParams>()

const onboardingScreenOptions: StackNavigationOptions = {
  headerShown: false,
}

interface OnboardingStackProps {
  destinationAfterComplete: DestinationStack
}

const OnboardingStack: FunctionComponent<OnboardingStackProps> = ({
  destinationAfterComplete,
}) => {
  const { t } = useTranslation()
  const navigation = useNavigation()

  const introduction: OnboardingScreen = {
    name: Screens.Introduction,
    screenNumber: 1,
    image: Images.PeopleHighFiving,
    imageLabel: t("onboarding.screen1_image_label"),
    header: t("onboarding.screen1_header"),
    primaryButtonLabel: t("onboarding.screen1_button"),
    primaryButtonOnPress: () =>
      navigation.navigate(Screens.PhoneRemembersDevices),
  }
  const phoneRemembersDevices = {
    name: Screens.PhoneRemembersDevices,
    screenNumber: 2,
    image: Images.PeopleOnPhones,
    imageLabel: t("onboarding.screen2_image_label"),
    header: t("onboarding.screen2_header"),
    primaryButtonLabel: t("onboarding.screen2_button"),
    primaryButtonOnPress: () => navigation.navigate(Screens.PersonalPrivacy),
  }
  const personalPrivacy = {
    name: Screens.PersonalPrivacy,
    screenNumber: 3,
    image: Images.PersonWithLockedPhone,
    imageLabel: t("onboarding.screen3_image_label"),
    header: t("onboarding.screen3_header"),
    primaryButtonLabel: t("onboarding.screen3_button"),
    primaryButtonOnPress: () => navigation.navigate(Screens.GetNotified),
  }
  const getNotified = {
    name: Screens.GetNotified,
    screenNumber: 4,
    image: Images.PersonGettingNotification,
    imageLabel: t("onboarding.screen4_image_label"),
    header: t("onboarding.screen4_header"),
    primaryButtonLabel: t("onboarding.screen4_button"),
    primaryButtonOnPress: () => navigation.navigate(Screens.ValueProposition),
  }
  const valueProposition = {
    name: Screens.ValueProposition,
    screenNumber: 5,
    image: Images.PersonAndHealthExpert,
    imageLabel: t("onboarding.screen5_image_label"),
    header: t("onboarding.screen5_header"),
    primaryButtonLabel: t("onboarding.screen_5_button"),
    primaryButtonOnPress: () => navigation.navigate(destinationAfterComplete),
  }

  const onboardingScreens: OnboardingScreen[] = [
    introduction,
    phoneRemembersDevices,
    personalPrivacy,
    getNotified,
    valueProposition,
  ]

  return (
    <Stack.Navigator screenOptions={onboardingScreenOptions}>
      <Stack.Screen name={Screens.Welcome} component={Welcome} />
      {onboardingScreens.map((onboardingScreenContent) => {
        return (
          <Stack.Screen
            key={onboardingScreenContent.header}
            name={onboardingScreenContent.name}
            component={() => Onboarding({ onboardingScreenContent })}
          />
        )
      })}
    </Stack.Navigator>
  )
}

export default OnboardingStack
