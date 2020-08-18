import React, { FunctionComponent } from "react"
import {
  createStackNavigator,
  StackNavigationOptions,
} from "@react-navigation/stack"

import { OnboardingScreen, OnboardingScreens } from "./index"

import Welcome from "../Onboarding/Welcome"
import PersonalPrivacy from "../Onboarding/PersonalPrivacy"
import Introduction from "../Onboarding/Introduction"
import PhoneRemembersDevices from "../Onboarding/PhoneRemembersDevices"
import GetNotified from "../Onboarding/GetNotified"
import ValueProposition from "../Onboarding/ValueProposition"

type OnboardingStackParams = {
  [key in OnboardingScreen]: undefined
}

const Stack = createStackNavigator<OnboardingStackParams>()

const onboardingScreenOptions: StackNavigationOptions = {
  headerShown: false,
}

const OnboardingStack: FunctionComponent = () => {
  return (
    <Stack.Navigator screenOptions={onboardingScreenOptions}>
      <Stack.Screen name={OnboardingScreens.Welcome} component={Welcome} />
      <Stack.Screen
        name={OnboardingScreens.Introduction}
        component={Introduction}
      />
      <Stack.Screen
        name={OnboardingScreens.PhoneRemembersDevices}
        component={PhoneRemembersDevices}
      />
      <Stack.Screen
        name={OnboardingScreens.PersonalPrivacy}
        component={PersonalPrivacy}
      />
      <Stack.Screen
        name={OnboardingScreens.GetNotified}
        component={GetNotified}
      />
      <Stack.Screen
        name={OnboardingScreens.ValueProposition}
        component={ValueProposition}
      />
    </Stack.Navigator>
  )
}

export default OnboardingStack
