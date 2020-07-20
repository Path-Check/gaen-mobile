import React from "react"
import { createStackNavigator } from "@react-navigation/stack"

import { AffectedUserProvider } from "./AffectedUserContext"
import Start from "./Start"
import CodeInput from "./CodeInput"
import Complete from "./Complete"
import PublishConsent from "./PublishConsent/PublishConsentScreen"

import { Screens } from "../navigation"

const Stack = createStackNavigator()

const AffectedUserStack = (): JSX.Element => {
  return (
    <AffectedUserProvider>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          gestureEnabled: false,
        }}
        initialRouteName={Screens.AffectedUserStart}
      >
        <Stack.Screen name={Screens.AffectedUserStart} component={Start} />
        <Stack.Screen
          name={Screens.AffectedUserCodeInput}
          component={CodeInput}
        />
        <Stack.Screen
          name={Screens.AffectedUserPublishConsent}
          component={PublishConsent}
        />
        <Stack.Screen
          name={Screens.AffectedUserComplete}
          component={Complete}
        />
      </Stack.Navigator>
    </AffectedUserProvider>
  )
}

export default AffectedUserStack

