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
import { LocationPermissions } from "../Device/useLocationPermissions"

import { Headers } from "../styles"

type ActivationStackParams = {
  [key in ActivationStackScreen]: undefined
}

type ActivationStep = {
  screenName: ActivationStackScreen
  component: FunctionComponent
}

type EnvironmentData = {
  locationPermissions: LocationPermissions
  isBluetoothOn: boolean
  displayAcceptTermsOfService: boolean
  enableProductAnalytics: boolean
}

const determineActivationSteps = ({
  displayAcceptTermsOfService,
  enableProductAnalytics,
  locationPermissions,
  isBluetoothOn,
}: EnvironmentData): ActivationStep[] => {
  const activationSteps: (ActivationStep | null)[] = []

  const activateExposureNotifications: ActivationStep = {
    screenName: ActivationStackScreens.ActivateExposureNotifications,
    component: ActivateExposureNotifications,
  }
  activationSteps.push(activateExposureNotifications)

  if (displayAcceptTermsOfService) {
    const acceptTermsOfService: ActivationStep = {
      screenName: ActivationStackScreens.AcceptTermsOfService,
      component: AcceptTermsOfService,
    }
    activationSteps.push(acceptTermsOfService)
  }

  if (enableProductAnalytics) {
    const anonymizedDataConsent: ActivationStep = {
      screenName: ActivationStackScreens.AnonymizedDataConsent,
      component: ProductAnalyticsConsentForm,
    }
    activationSteps.push(anonymizedDataConsent)
  }

  const isLocationRequired = locationPermissions !== "NotRequired"
  if (isLocationRequired) {
    const activateLocation: ActivationStep = {
      screenName: ActivationStackScreens.ActivateLocation,
      component: ActivateLocation,
    }
    activationSteps.push(activateLocation)
  }

  if (!isBluetoothOn) {
    const activateBluetooth: ActivationStep = {
      screenName: ActivationStackScreens.ActivateBluetooth,
      component: ActivateBluetooth,
    }
    activationSteps.push(activateBluetooth)
  }

  if (Platform.OS === "ios") {
    const notificationPermissions: ActivationStep = {
      screenName: ActivationStackScreens.NotificationPermissions,
      component: NotificationPermissions,
    }
    activationSteps.push(notificationPermissions)
  }

  const activationSummary: ActivationStep = {
    screenName: ActivationStackScreens.ActivationSummary,
    component: ActivationSummary,
  }
  activationSteps.push(activationSummary)

  return activationSteps as ActivationStep[]
}

const Stack = createStackNavigator<ActivationStackParams>()

const ActivationStack: FunctionComponent = () => {
  const { locationPermissions, isBluetoothOn } = usePermissionsContext()
  const {
    displayAcceptTermsOfService,
    enableProductAnalytics,
  } = useConfigurationContext()

  const environmentData = {
    locationPermissions,
    isBluetoothOn,
    displayAcceptTermsOfService,
    enableProductAnalytics,
  }

  const activationSteps = determineActivationSteps(environmentData)

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
