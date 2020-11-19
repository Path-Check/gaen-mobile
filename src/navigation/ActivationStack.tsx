import React, { FunctionComponent } from "react"
import { Platform } from "react-native"
import { createStackNavigator } from "@react-navigation/stack"

import { ActivationStackScreen, ActivationStackScreens } from "./index"
import { usePermissionsContext } from "../Device/PermissionsContext"
import ActivateExposureNotifications from "../Activation/ActivateExposureNotifications"
import ActivateLocation from "../Activation/ActivateLocation"
import NotificationPermissions from "../Activation/NotificationPermissions"
import ActivationSummary from "../Activation/ActivationSummary"
import ActivateBluetooth from "../Activation/ActivateBluetooth"
import AcceptTermsOfService from "../Activation/AcceptTermsOfService"
import ProductAnalyticsConsentForm from "../Activation/ProductAnalyticsConsentForm"
import { useConfigurationContext } from "../ConfigurationContext"
import { applyHeaderLeftBackButton } from "../navigation/HeaderLeftBackButton"

import { Headers } from "../styles"

type ActivationStackParams = {
  [key in ActivationStackScreen]: undefined
}

const Stack = createStackNavigator<ActivationStackParams>()

const ActivationStack: FunctionComponent = () => {
  const { locationPermissions, isBluetoothOn } = usePermissionsContext()
  const {
    displayAcceptTermsOfService,
    enableProductAnalytics,
  } = useConfigurationContext()

  interface ActivationStep {
    screenName: ActivationStackScreen
    component: FunctionComponent
  }

  const activateExposureNotifications: ActivationStep = {
    screenName: ActivationStackScreens.ActivateExposureNotifications,
    component: ActivateExposureNotifications,
  }

  const activateLocation: ActivationStep = {
    screenName: ActivationStackScreens.ActivateLocation,
    component: ActivateLocation,
  }

  const notificationPermissions: ActivationStep = {
    screenName: ActivationStackScreens.NotificationPermissions,
    component: NotificationPermissions,
  }

  const baseActivationSteps: ActivationStep[] = [activateExposureNotifications]

  if (displayAcceptTermsOfService) {
    const acceptTermsOfService: ActivationStep = {
      screenName: ActivationStackScreens.AcceptTermsOfService,
      component: AcceptTermsOfService,
    }
    baseActivationSteps.unshift(acceptTermsOfService)
  }

  if (!isBluetoothOn) {
    const activateBluetooth: ActivationStep = {
      screenName: ActivationStackScreens.ActivateBluetooth,
      component: ActivateBluetooth,
    }
    baseActivationSteps.push(activateBluetooth)
  }

  const activationStepsIOS: ActivationStep[] = [
    ...baseActivationSteps,
    notificationPermissions,
  ]

  const isLocationRequired = locationPermissions !== "NotRequired"
  const activationStepsAndroid: ActivationStep[] = isLocationRequired
    ? [...baseActivationSteps, activateLocation]
    : baseActivationSteps

  const activationSteps = Platform.select({
    ios: activationStepsIOS,
    android: activationStepsAndroid,
    default: activationStepsIOS,
  })

  if (enableProductAnalytics) {
    const anonymizedDataConsent: ActivationStep = {
      screenName: ActivationStackScreens.AnonymizedDataConsent,
      component: ProductAnalyticsConsentForm,
    }
    activationSteps.unshift(anonymizedDataConsent)
  }

  const activationSummary: ActivationStep = {
    screenName: ActivationStackScreens.ActivationSummary,
    component: ActivationSummary,
  }
  activationSteps.push(activationSummary)

  return (
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
  )
}

export default ActivationStack
