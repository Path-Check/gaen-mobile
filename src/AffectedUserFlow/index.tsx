import React from "react"
import { createStackNavigator } from "@react-navigation/stack"

import { AffectedUserProvider } from "./AffectedUserContext"
import Start from "./Start"
import CodeInput from "./CodeInput"
import Complete from "./Complete"
import PublishConsent from "./PublishConsent/PublishConsentScreen"

import { AffectedUserFlowScreen, AffectedUserFlowScreens } from "../navigation"

type AffectedUserFlowStackParams = {
  [key in AffectedUserFlowScreen]: undefined
}
const Stack = createStackNavigator<AffectedUserFlowStackParams>()

const AffectedUserStack = (): JSX.Element => {
  return (
    <AffectedUserProvider>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          gestureEnabled: false,
        }}
        initialRouteName={AffectedUserFlowScreens.AffectedUserStart}
      >
        <Stack.Screen
          name={AffectedUserFlowScreens.AffectedUserStart}
          component={Start}
        />
        <Stack.Screen
          name={AffectedUserFlowScreens.AffectedUserCodeInput}
          component={CodeInput}
        />
        <Stack.Screen
          name={AffectedUserFlowScreens.AffectedUserPublishConsent}
          component={PublishConsent}
        />
        <Stack.Screen
          name={AffectedUserFlowScreens.AffectedUserComplete}
          component={Complete}
        />
      </Stack.Navigator>
    </AffectedUserProvider>
  )
}

export default AffectedUserStack
