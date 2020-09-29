import React, { FunctionComponent } from "react"
import { ImageSourcePropType } from "react-native"
import { useTranslation } from "react-i18next"
import { useNavigation } from "@react-navigation/native"
import { createStackNavigator } from "@react-navigation/stack"

import {
  HowItWorksStackScreen,
  HowItWorksStackScreens,
  Stack as StackType,
} from "../navigation/index"
import HowItWorksScreen from "../HowItWorks/HowItWorksScreen"

import { Images } from "../assets"

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
  const { t } = useTranslation()
  const navigation = useNavigation()

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

  const HowItWorksScreenData: HowItWorksScreenDatum[] = [
    introduction,
    phoneRemembersDevices,
    personalPrivacy,
    getNotified,
    valueProposition,
  ]

  const toStackScreen = (datum: HowItWorksScreenDatum, idx: number) => {
    const screenNumber = idx + 1
    const HowItWorksScreenDisplayDatum = {
      screenNumber,
      ...datum,
    }

    return (
      <Stack.Screen
        key={HowItWorksScreenDisplayDatum.header}
        name={HowItWorksScreenDisplayDatum.name}
      >
        {(props) => (
          <HowItWorksScreen
            {...props}
            HowItWorksScreenContent={HowItWorksScreenDisplayDatum}
            totalScreenCount={HowItWorksScreenData.length}
            destinationOnSkip={destinationOnSkip}
          />
        )}
      </Stack.Screen>
    )
  }

  return (
    <Stack.Navigator headerMode="none">
      {HowItWorksScreenData.map((data, idx) => toStackScreen(data, idx))}
    </Stack.Navigator>
  )
}

const MemoizedHowItWorksStack = React.memo(HowItWorksStack)

export default MemoizedHowItWorksStack
