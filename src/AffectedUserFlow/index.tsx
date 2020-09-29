import React, { FunctionComponent } from "react"
import { createStackNavigator } from "@react-navigation/stack"

import { AffectedUserProvider } from "./AffectedUserContext"
import Start from "./Start"
import CodeInput from "./CodeInput/CodeInputScreen"
import Complete from "./Complete"
import PublishConsent from "./PublishConsent/PublishConsentScreen"

import {
  AffectedUserFlowStackScreen,
  AffectedUserFlowStackScreens,
} from "../navigation"

type AffectedUserFlowStackParams = {
  [key in AffectedUserFlowStackScreen]: undefined
}
const Stack = createStackNavigator<AffectedUserFlowStackParams>()

const AffectedUserStack: FunctionComponent = () => {
  return (
    <AffectedUserProvider>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen
          name={AffectedUserFlowStackScreens.AffectedUserStart}
          component={Start}
        />
        <Stack.Screen
          name={AffectedUserFlowStackScreens.AffectedUserCodeInput}
          component={CodeInput}
        />
        <Stack.Screen
          name={AffectedUserFlowStackScreens.AffectedUserPublishConsent}
          component={PublishConsent}
        />
        <Stack.Screen
          name={AffectedUserFlowStackScreens.AffectedUserComplete}
          component={Complete}
        />
      </Stack.Navigator>
    </AffectedUserProvider>
  )
}

export default AffectedUserStack
