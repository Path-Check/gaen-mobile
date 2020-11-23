import React, { FunctionComponent } from "react"
import { createStackNavigator } from "@react-navigation/stack"

import { ActivationStackScreen, ActivationStackScreens } from "./index"
import ActivateExposureNotifications from "../Activation/ActivateExposureNotifications"
import ActivateLocation from "../Activation/ActivateLocation"
import NotificationPermissions from "../Activation/NotificationPermissions"
import ActivationSummary from "../Activation/ActivationSummary"
import AcceptTermsOfService from "../Activation/AcceptTermsOfService"
import ProductAnalyticsConsentForm from "../Activation/ProductAnalyticsConsentForm"
import {
  useActivationNavigation,
  toScreen,
} from "../Activation/useActivationNavigation"
import { applyHeaderLeftBackButton } from "../navigation/HeaderLeftBackButton"

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
  const ProductAnalyticsConsent: ActivationStep = {
    screenName: ActivationStackScreens.ProductAnalyticsConsent,
    component: ProductAnalyticsConsentForm,
  }
  const activateLocation: ActivationStep = {
    screenName: ActivationStackScreens.ActivateLocation,
    component: ActivateLocation,
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
    ProductAnalyticsConsent,
    activateLocation,
    activateExposureNotifications,
    notificationPermissions,
    activationSummary,
  ]

  const { activationSteps: inUseActivationSteps } = useActivationNavigation()
  const initialRouteName = toScreen(inUseActivationSteps[0])

  return (
    <Stack.Navigator
      initialRouteName={initialRouteName}
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
  )
}

export default ActivationStack
