import React, { FunctionComponent } from "react"
import { createStackNavigator } from "@react-navigation/stack"

import NotificationPermissions from "../Onboarding/NotificationPermissions"
import EnableExposureNotifications from "../Onboarding/EnableExposureNotifications"
import Welcome from "../Onboarding/Welcome"
import PersonalPrivacy from "../Onboarding/PersonalPrivacy"
import NotificationDetails from "../Onboarding/NotificationDetails"
import ShareDiagnosis from "../Onboarding/ShareDiagnosis"

import { Screens } from "./index"

const SCREEN_OPTIONS = {
  headerShown: false,
}

const Stack = createStackNavigator()

const OnboardingStack: FunctionComponent = () => (
  <Stack.Navigator screenOptions={SCREEN_OPTIONS}>
    <Stack.Screen name={Screens.Welcome} component={Welcome} />
    <Stack.Screen name={Screens.PersonalPrivacy} component={PersonalPrivacy} />
    <Stack.Screen
      name={Screens.NotificationDetails}
      component={NotificationDetails}
    />
    <Stack.Screen name={Screens.ShareDiagnosis} component={ShareDiagnosis} />
    <Stack.Screen
      name={Screens.NotificationPermissions}
      component={NotificationPermissions}
    />
    <Stack.Screen
      name={Screens.EnableExposureNotifications}
      component={EnableExposureNotifications}
    />
  </Stack.Navigator>
)

export default OnboardingStack
