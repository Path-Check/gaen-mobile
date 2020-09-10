import React, { FunctionComponent } from "react"
import { createStackNavigator } from "@react-navigation/stack"

import { Stacks, ModalScreens } from "./index"
import LanguageSelection from "../modals/LanguageSelection"
import ProtectPrivacy from "../modals/ProtectPrivacy"
import AffectedUserStack from "../AffectedUserFlow/"
import OnboardingStack from "./OnboardingStack"

const Stack = createStackNavigator()

const ModalStack: FunctionComponent = () => {
  return (
    <Stack.Navigator headerMode="none">
      <Stack.Screen
        name={ModalScreens.LanguageSelection}
        component={LanguageSelection}
      />
      <Stack.Screen
        name={ModalScreens.ProtectPrivacy}
        component={ProtectPrivacy}
      />
      <Stack.Screen
        name={Stacks.AffectedUserStack}
        component={AffectedUserStack}
        options={{
          gestureEnabled: false,
        }}
      />
      <Stack.Screen
        name={Stacks.OnboardingReview}
        component={OnboardingStack}
      />
    </Stack.Navigator>
  )
}

export default ModalStack
