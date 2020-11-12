import React, { FunctionComponent } from "react"
import { createStackNavigator } from "@react-navigation/stack"

import { AffectedUserProvider } from "../AffectedUserFlow/AffectedUserContext"
import Start from "../AffectedUserFlow/Start"
import CodeInput from "../AffectedUserFlow/CodeInput/CodeInputScreen"
import Complete from "../AffectedUserFlow/Complete"
import PublishConsent from "../AffectedUserFlow/PublishConsent/PublishConsentScreen"
import { AffectedUserFlowStackScreen, AffectedUserFlowStackScreens } from "."
import { applyHeaderLeftBackButton } from "./HeaderLeftBackButton"

import { Headers } from "../styles"

type AffectedUserFlowStackParams = {
  [key in AffectedUserFlowStackScreen]: undefined
}

const Stack = createStackNavigator<AffectedUserFlowStackParams>()

const AffectedUserStack: FunctionComponent = () => {
  return (
    <AffectedUserProvider>
      <Stack.Navigator
        screenOptions={{ headerShown: false, gestureEnabled: false }}
      >
        <Stack.Screen
          name={AffectedUserFlowStackScreens.AffectedUserStart}
          component={Start}
          options={{
            ...Headers.headerMinimalOptions,
            headerLeft: applyHeaderLeftBackButton(),
          }}
        />
        <Stack.Screen
          name={AffectedUserFlowStackScreens.AffectedUserCodeInput}
          component={CodeInput}
          options={{
            ...Headers.headerMinimalOptions,
            headerLeft: applyHeaderLeftBackButton(),
          }}
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
