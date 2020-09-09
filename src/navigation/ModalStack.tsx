import React, { FunctionComponent } from "react"
import {
  createStackNavigator,
  TransitionPresets,
} from "@react-navigation/stack"

import { Stacks, ModalScreens } from "./index"
import LanguageSelection from "../Modal/LanguageSelection"
import ProtectPrivacy from "../Modal/ProtectPrivacy"
import AffectedUserStack from "../AffectedUserFlow/"

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
        options={{
          ...TransitionPresets.ModalTransition,
          headerShown: false,
        }}
      />
      <Stack.Screen
        name={Stacks.AffectedUserStack}
        component={AffectedUserStack}
        options={{
          gestureEnabled: false,
        }}
      />
    </Stack.Navigator>
  )
}

export default ModalStack
