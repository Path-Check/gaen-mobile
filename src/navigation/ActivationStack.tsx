import React, { FunctionComponent } from "react"
import { createStackNavigator } from "@react-navigation/stack"

import { ActivationStackScreen, ActivationStackScreens } from "./index"
import ActivateExposureNotifications from "../Activation/ActivateExposureNotifications"
import ActivateLocation from "../Activation/ActivateLocation"
import NotificationPermissions from "../Activation/NotificationPermissions"
import ActivationSummary from "../Activation/ActivationSummary"
import ActivateBluetooth from "../Activation/ActivateBluetooth"
import AcceptTermsOfService from "../Activation/AcceptTermsOfService"
import ProductAnalyticsConsentForm from "../Activation/ProductAnalyticsConsentForm"
import { applyHeaderLeftBackButton } from "../navigation/HeaderLeftBackButton"
import { ActivationProvider } from "../Activation/ActivationContext"

import { Headers } from "../styles"

type ActivationStackParams = {
  [key in ActivationStackScreen]: undefined
}

type ActivationStep = {
  screenName: ActivationStackScreen
  component: FunctionComponent
}

const Stack = createStackNavigator<ActivationStackParams>()

const ActivationStack: FunctionComponent = () => {
  const acceptTermsOfService: ActivationStep = {
    screenName: ActivationStackScreens.AcceptTermsOfService,
    component: AcceptTermsOfService,
  }
  const anonymizedDataConsent: ActivationStep = {
    screenName: ActivationStackScreens.AnonymizedDataConsent,
    component: ProductAnalyticsConsentForm,
  }
  const activateLocation: ActivationStep = {
    screenName: ActivationStackScreens.ActivateLocation,
    component: ActivateLocation,
  }
  const activateBluetooth: ActivationStep = {
    screenName: ActivationStackScreens.ActivateBluetooth,
    component: ActivateBluetooth,
  }
  const activateExposureNotifications: ActivationStep = {
    screenName: ActivationStackScreens.ActivateExposureNotifications,
    component: ActivateExposureNotifications,
  }
  const notificationPermissions: ActivationStep = {
    screenName: ActivationStackScreens.NotificationPermissions,
    component: NotificationPermissions,
  }
  const activationSummary: ActivationStep = {
    screenName: ActivationStackScreens.ActivationSummary,
    component: ActivationSummary,
  }

  const activationSteps = [
    acceptTermsOfService,
    anonymizedDataConsent,
    activateLocation,
    activateBluetooth,
    activateExposureNotifications,
    notificationPermissions,
    activationSummary,
  ]

  return (
    <ActivationProvider>
      <Stack.Navigator
        initialRouteName={ActivationStackScreens.AcceptTermsOfService}
        screenOptions={{
          ...Headers.headerMinimalOptions,
          headerLeft: applyHeaderLeftBackButton(),
          headerTitle: () => null,
        }}
      >
        {activationSteps.map((step) => {
          return (
            <Stack.Screen
              name={step.screenName}
              component={step.component}
              key={`activation-screen-${step.screenName}`}
            />
          )
        })}
      </Stack.Navigator>
    </ActivationProvider>
  )
}

export default ActivationStack
