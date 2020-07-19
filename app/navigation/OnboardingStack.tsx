import React, { FunctionComponent } from "react"
import { createStackNavigator } from "@react-navigation/stack"

import NotificationPermissions from "../bt/NotificationPermissions"
import { EnableExposureNotifications } from "../views/onboarding/EnableExposureNotifications"
import Welcome from "../views/onboarding/Welcome"
import PersonalPrivacy from "../views/onboarding/PersonalPrivacy"
import NotificationDetails from "../views/onboarding/NotificationDetails"
import ShareDiagnosis from "../views/onboarding/ShareDiagnosis"

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
