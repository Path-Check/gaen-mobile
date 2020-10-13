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
import { applyHeaderLeftBackButton } from "../navigation/HeaderLeftBackButton"

import { Headers } from "../styles"

type AffectedUserFlowStackParams = {
  [key in AffectedUserFlowStackScreen]: undefined
}

const Stack = createStackNavigator<AffectedUserFlowStackParams>()

const AffectedUserStack: FunctionComponent = () => {
  return (
    <AffectedUserProvider>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
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
          options={{
            ...Headers.headerMinimalOptions,
            headerLeft: applyHeaderLeftBackButton(),
          }}
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
