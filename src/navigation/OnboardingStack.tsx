import React, { FunctionComponent } from "react"
import {
  TransitionPresets,
  createStackNavigator,
  StackNavigationOptions,
} from "@react-navigation/stack"

import NotificationPermissions from "../Onboarding/NotificationPermissions"
import EnableExposureNotifications from "../Onboarding/EnableExposureNotifications"
import Welcome from "../Onboarding/Welcome"
import PersonalPrivacy from "../Onboarding/PersonalPrivacy"
import EulaModal from "../Onboarding/EulaModal"
import NotificationDetails from "../Onboarding/NotificationDetails"
import ShareDiagnosis from "../Onboarding/ShareDiagnosis"
import LanguageSelection from "../More/LanguageSelection"

import { OnboardingScreen, OnboardingScreens } from "./index"

type OnboardingStackParams = {
  [key in OnboardingScreen]: undefined
}

const Stack = createStackNavigator<OnboardingStackParams>()

const OnboardingStack: FunctionComponent = () => {
  const onboardingScreenOptions: StackNavigationOptions = {
    headerShown: false,
  }

  return (
    <Stack.Navigator screenOptions={onboardingScreenOptions}>
      <Stack.Screen name={OnboardingScreens.Welcome} component={Welcome} />
      <Stack.Screen
        name={OnboardingScreens.EulaModal}
        component={EulaModal}
        options={{ ...TransitionPresets.ModalTransition }}
      />
      <Stack.Screen
        name={OnboardingScreens.PersonalPrivacy}
        component={PersonalPrivacy}
      />
      <Stack.Screen
        name={OnboardingScreens.NotificationDetails}
        component={NotificationDetails}
      />
      <Stack.Screen
        name={OnboardingScreens.ShareDiagnosis}
        component={ShareDiagnosis}
      />
      <Stack.Screen
        name={OnboardingScreens.NotificationPermissions}
        component={NotificationPermissions}
      />
      <Stack.Screen
        name={OnboardingScreens.EnableExposureNotifications}
        component={EnableExposureNotifications}
      />
      <Stack.Screen
        name={OnboardingScreens.LanguageSelection}
        component={LanguageSelection}
      />
    </Stack.Navigator>
  )
}

export default OnboardingStack

