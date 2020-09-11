import { useNavigation } from "@react-navigation/native"
import { ImageSourcePropType } from "react-native"
import { useTranslation } from "react-i18next"

import {
  OnboardingScreen as Screen,
  OnboardingScreens as Screens,
  Stack,
} from "../navigation/index"

import { Images } from "../assets"

export type OnboardingScreenContent = {
  name: Screen
  image: ImageSourcePropType
  imageLabel: string
  header: string
  primaryButtonLabel: string
  primaryButtonOnPress: () => void
}

const useOnboardingData = (
  destinationAfterComplete: Stack,
): OnboardingScreenContent[] => {
  const { t } = useTranslation()
  const navigation = useNavigation()

  const introduction: OnboardingScreenContent = {
    name: Screens.Introduction,
    image: Images.PeopleHighFiving,
    imageLabel: t("onboarding.screen1_image_label"),
    header: t("onboarding.screen1_header"),
    primaryButtonLabel: t("onboarding.screen1_button"),
    primaryButtonOnPress: () =>
      navigation.navigate(Screens.PhoneRemembersDevices),
  }
  const phoneRemembersDevices: OnboardingScreenContent = {
    name: Screens.PhoneRemembersDevices,
    image: Images.PeopleOnPhones,
    imageLabel: t("onboarding.screen2_image_label"),
    header: t("onboarding.screen2_header"),
    primaryButtonLabel: t("onboarding.screen2_button"),
    primaryButtonOnPress: () => navigation.navigate(Screens.PersonalPrivacy),
  }
  const personalPrivacy: OnboardingScreenContent = {
    name: Screens.PersonalPrivacy,
    image: Images.PersonWithLockedPhone,
    imageLabel: t("onboarding.screen3_image_label"),
    header: t("onboarding.screen3_header"),
    primaryButtonLabel: t("onboarding.screen3_button"),
    primaryButtonOnPress: () => navigation.navigate(Screens.GetNotified),
  }
  const getNotified: OnboardingScreenContent = {
    name: Screens.GetNotified,
    image: Images.PersonGettingNotification,
    imageLabel: t("onboarding.screen4_image_label"),
    header: t("onboarding.screen4_header"),
    primaryButtonLabel: t("onboarding.screen4_button"),
    primaryButtonOnPress: () => navigation.navigate(Screens.ValueProposition),
  }
  const valueProposition: OnboardingScreenContent = {
    name: Screens.ValueProposition,
    image: Images.PersonAndHealthExpert,
    imageLabel: t("onboarding.screen5_image_label"),
    header: t("onboarding.screen5_header"),
    primaryButtonLabel: t("onboarding.screen_5_button"),
    primaryButtonOnPress: () => navigation.navigate(destinationAfterComplete),
  }

  const onboardingScreens: OnboardingScreenContent[] = [
    introduction,
    phoneRemembersDevices,
    personalPrivacy,
    getNotified,
    valueProposition,
  ]

  return onboardingScreens
}

export default useOnboardingData
