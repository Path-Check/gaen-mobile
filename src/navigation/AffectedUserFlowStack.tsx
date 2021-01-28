import React, { FunctionComponent } from "react"
import { createStackNavigator } from "@react-navigation/stack"

import { AffectedUserProvider } from "../AffectedUserFlow/AffectedUserContext"
import Start from "../AffectedUserFlow/Start"
import CodeInput from "../AffectedUserFlow/CodeInput/CodeInputScreen"
import SymptomOnsetDate from "../AffectedUserFlow/SymptomOnsetDate"
import Complete from "../AffectedUserFlow/Complete"
import PublishConsent from "../AffectedUserFlow/PublishConsent/PublishConsentScreen"
import VerificationCodeInfo from "../AffectedUserFlow/VerificationCodeInfo"
import { AffectedUserFlowStackScreens } from "."
import { applyHeaderLeftBackButton } from "./HeaderLeftBackButton"
import { useOnboardingContext } from "../OnboardingContext"

import { Headers } from "../styles"

export type AffectedUserFlowStackParamList = {
  AffectedUserStart: undefined
  VerificationCodeInfo: undefined
  AffectedUserCodeInput: { code?: string; c?: string }
  SymptomOnsetDate: undefined
  AffectedUserPublishConsent: undefined
  AffectedUserConfirmUpload: undefined
  AffectedUserExportDone: undefined
  AffectedUserComplete: undefined
}

const Stack = createStackNavigator<AffectedUserFlowStackParamList>()

const AffectedUserStack: FunctionComponent = () => {
  const { isOnboardingComplete } = useOnboardingContext()

  return (
    <AffectedUserProvider isOnboardingComplete={isOnboardingComplete}>
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
          name={AffectedUserFlowStackScreens.VerificationCodeInfo}
          component={VerificationCodeInfo}
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
          name={AffectedUserFlowStackScreens.SymptomOnsetDate}
          component={SymptomOnsetDate}
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
