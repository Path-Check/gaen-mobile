import React, {
  createContext,
  useState,
  useContext,
  FunctionComponent,
  useEffect,
} from "react"
import { Platform } from "react-native"
import { useNavigation } from "@react-navigation/native"

import { useConfigurationContext } from "../ConfigurationContext"
import { usePermissionsContext } from "../Device/PermissionsContext"
import { LocationPermissions } from "../Device/useLocationPermissions"
import {
  ActivationStackScreen,
  ActivationStackScreens,
  Stacks,
} from "../navigation"
import { useOnboardingContext } from "../OnboardingContext"

type ActivationStep =
  | "AcceptTermsOfService"
  | "AnonymizedDataConsent"
  | "ActivateLocation"
  | "ActivateBluetooth"
  | "ActivateExposureNotifications"
  | "NotificationPermissions"
  | "ActivationSummary"

const toScreen = (step: ActivationStep): ActivationStackScreen => {
  switch (step) {
    case "AcceptTermsOfService":
      return ActivationStackScreens.AcceptTermsOfService
    case "AnonymizedDataConsent":
      return ActivationStackScreens.AnonymizedDataConsent
    case "ActivateLocation":
      return ActivationStackScreens.ActivateLocation
    case "ActivateBluetooth":
      return ActivationStackScreens.ActivateBluetooth
    case "ActivateExposureNotifications":
      return ActivationStackScreens.ActivateExposureNotifications
    case "NotificationPermissions":
      return ActivationStackScreens.NotificationPermissions
    case "ActivationSummary":
      return ActivationStackScreens.ActivationSummary
  }
}

export const ActivationContext = createContext<
  ActivationContextState | undefined
>(undefined)

export interface ActivationContextState {
  activationSteps: ActivationStep[]
  goToNextScreen: () => void
  goToPreviousScreen: () => void
}

export const ActivationProvider: FunctionComponent = ({ children }) => {
  const {
    displayAcceptTermsOfService,
    enableProductAnalytics,
  } = useConfigurationContext()
  const navigation = useNavigation()
  const { locationPermissions, isBluetoothOn } = usePermissionsContext()
  const { completeOnboarding } = useOnboardingContext()

  const [activationSteps, setActivationSteps] = useState<ActivationStep[]>([])
  const [currentStep, setCurrentStep] = useState(0)

  useEffect(() => {
    const environment = {
      displayAcceptTermsOfService,
      enableProductAnalytics,
      locationPermissions,
      isBluetoothOn,
    }

    setActivationSteps(determineActivationSteps(environment))
  }, [
    displayAcceptTermsOfService,
    enableProductAnalytics,
    locationPermissions,
    isBluetoothOn,
  ])

  const goToNextScreen = () => {
    console.log({ currentStep })
    const nextStepIndex = currentStep + 1
    if (nextStepIndex < activationSteps.length) {
      setCurrentStep(nextStepIndex)
      const nextStepName = activationSteps[nextStepIndex]
      console.log({ nextStepName })
      const nextScreen = toScreen(nextStepName)
      navigation.navigate(nextScreen)
    } else {
      completeOnboarding()
    }
  }

  const goToPreviousScreen = () => {
    const previousStepIndex = currentStep - 1
    if (previousStepIndex < 0) {
      navigation.navigate(Stacks.HowItWorks)
    } else {
      setCurrentStep(previousStepIndex)
      const previousStepName = activationSteps[previousStepIndex]
      const previousScreen = toScreen(previousStepName)
      navigation.navigate(previousScreen)
    }
  }

  return (
    <ActivationContext.Provider
      value={{
        activationSteps,
        goToNextScreen,
        goToPreviousScreen,
      }}
    >
      {children}
    </ActivationContext.Provider>
  )
}

export const useActivationContext = (): ActivationContextState => {
  const context = useContext(ActivationContext)
  if (context === undefined) {
    throw new Error("ActivationContext must be used with a provider")
  }
  return context
}

type Environment = {
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
}: Environment): ActivationStep[] => {
  const isLocationRequired = locationPermissions !== "NotRequired"

  const activationSteps: ActivationStep[] = []

  displayAcceptTermsOfService && activationSteps.push("AcceptTermsOfService")
  enableProductAnalytics && activationSteps.push("AnonymizedDataConsent")
  isLocationRequired && activationSteps.push("ActivateLocation")
  !isBluetoothOn && activationSteps.push("ActivateBluetooth")
  activationSteps.push("ActivateExposureNotifications")
  Platform.OS === "ios" && activationSteps.push("NotificationPermissions")
  activationSteps.push("ActivationSummary")

  return activationSteps
}
