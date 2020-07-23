import React, { FunctionComponent } from "react"
import {
  createStackNavigator,
  TransitionPresets,
} from "@react-navigation/stack"
import { NavigationContainer } from "@react-navigation/native"
import env from "react-native-config"

import MainTabNavigator from "./MainTabNavigator"
import OnboardingStack from "./OnboardingStack"
import { useOnboardingContext } from "../OnboardingContext"
import { Screens, Stacks } from "./index"
import AffectedUserStack from "../AffectedUserFlow"
import MoreInfo from "../ExposureHistory/MoreInfo"
import NextSteps from "../ExposureHistory/NextSteps"

const Stack = createStackNavigator()

const SCREEN_OPTIONS = {
  headerShown: false,
}

const MainNavigator: FunctionComponent = () => {
  const { onboardingIsComplete } = useOnboardingContext()
  const displayNextSteps =
    env.DISPLAY_SELF_ASSESSMENT === "true" || env.AUTHORITY_ADVICE_URL

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={SCREEN_OPTIONS}>
        {onboardingIsComplete ? (
          <>
            <Stack.Screen name={"App"} component={MainTabNavigator} />
            <Stack.Screen
              name={Stacks.AffectedUserStack}
              component={AffectedUserStack}
              options={{ ...TransitionPresets.ModalTransition }}
            />
            <Stack.Screen
              name={Screens.MoreInfo}
              component={MoreInfo}
              options={{ ...TransitionPresets.ModalTransition }}
            />
            {displayNextSteps && (
              <Stack.Screen
                name={Screens.NextSteps}
                component={NextSteps}
                options={{ ...TransitionPresets.ModalTransition }}
              />
            )}
          </>
        ) : (
          <Stack.Screen name={Stacks.Onboarding} component={OnboardingStack} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  )
}

export default MainNavigator
