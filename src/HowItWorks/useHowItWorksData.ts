import { useNavigation } from "@react-navigation/native"
import { ImageSourcePropType } from "react-native"
import { useTranslation } from "react-i18next"

import {
  HowItWorksScreen,
  HowItWorksScreens,
  Stack,
  Stacks,
} from "../navigation/index"

import { Images } from "../assets"

export type HowItWorksScreenDatum = {
  name: HowItWorksScreen
  image: ImageSourcePropType
  imageLabel: string
  header: string
  primaryButtonLabel: string
  primaryButtonOnPress: () => void
}

const useHowItWorksData = (
  destinationAfterComplete: Stack = Stacks.Home,
): HowItWorksScreenDatum[] => {
  const { t } = useTranslation()
  const navigation = useNavigation()

  const introduction: HowItWorksScreenDatum = {
    name: HowItWorksScreens.Introduction,
    image: Images.PeopleHighFiving,
    imageLabel: t("onboarding.screen1_image_label"),
    header: t("onboarding.screen1_header"),
    primaryButtonLabel: t("onboarding.screen1_button"),
    primaryButtonOnPress: () =>
      navigation.navigate(HowItWorksScreens.PhoneRemembersDevices),
  }
  const phoneRemembersDevices: HowItWorksScreenDatum = {
    name: HowItWorksScreens.PhoneRemembersDevices,
    image: Images.PeopleOnPhones,
    imageLabel: t("onboarding.screen2_image_label"),
    header: t("onboarding.screen2_header"),
    primaryButtonLabel: t("onboarding.screen2_button"),
    primaryButtonOnPress: () =>
      navigation.navigate(HowItWorksScreens.PersonalPrivacy),
  }
  const personalPrivacy: HowItWorksScreenDatum = {
    name: HowItWorksScreens.PersonalPrivacy,
    image: Images.PersonWithLockedPhone,
    imageLabel: t("onboarding.screen3_image_label"),
    header: t("onboarding.screen3_header"),
    primaryButtonLabel: t("onboarding.screen3_button"),
    primaryButtonOnPress: () =>
      navigation.navigate(HowItWorksScreens.GetNotified),
  }
  const getNotified: HowItWorksScreenDatum = {
    name: HowItWorksScreens.GetNotified,
    image: Images.PersonGettingNotification,
    imageLabel: t("onboarding.screen4_image_label"),
    header: t("onboarding.screen4_header"),
    primaryButtonLabel: t("onboarding.screen4_button"),
    primaryButtonOnPress: () =>
      navigation.navigate(HowItWorksScreens.ValueProposition),
  }
  const valueProposition: HowItWorksScreenDatum = {
    name: HowItWorksScreens.ValueProposition,
    image: Images.PersonAndHealthExpert,
    imageLabel: t("onboarding.screen5_image_label"),
    header: t("onboarding.screen5_header"),
    primaryButtonLabel: t("onboarding.screen_5_button"),
    primaryButtonOnPress: () => navigation.navigate(destinationAfterComplete),
  }

  const howItWorksScreensScreensData: HowItWorksScreenDatum[] = [
    introduction,
    phoneRemembersDevices,
    personalPrivacy,
    getNotified,
    valueProposition,
  ]

  return howItWorksScreensScreensData
}

export default useHowItWorksData
