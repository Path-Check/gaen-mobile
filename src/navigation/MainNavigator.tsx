import React, { FunctionComponent } from "react"
import {
  createStackNavigator,
  TransitionPresets,
} from "@react-navigation/stack"
import { NavigationContainer } from "@react-navigation/native"

import MainTabNavigator from "./MainTabNavigator"
import OnboardingStack from "./OnboardingStack"
import { useOnboardingContext } from "../OnboardingContext"
import { Stacks } from "./index"
import AffectedUserStack from "../AffectedUserFlow"

const Stack = createStackNavigator()

const SCREEN_OPTIONS = {
  headerShown: false,
}

const MainNavigator: FunctionComponent = () => {
  const { isComplete } = useOnboardingContext()
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={SCREEN_OPTIONS}>
        {isComplete ? (
          <Stack.Screen name={"App"} component={MainTabNavigator} />
        ) : (
          <Stack.Screen name={Stacks.Onboarding} component={OnboardingStack} />
        )}
        <Stack.Screen
          name={Stacks.AffectedUserStack}
          component={AffectedUserStack}
          options={TransitionPresets.ModalTransition}
        />
      </Stack.Navigator>
    </NavigationContainer>
  )
}

export default MainNavigator

