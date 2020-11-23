import { Platform } from "react-native"
import { useNavigation } from "@react-navigation/native"

import { useConfigurationContext } from "../ConfigurationContext"
import { usePermissionsContext } from "../Device/PermissionsContext"
import { LocationPermissions } from "../Device/useLocationPermissions"
import { ActivationStackScreen, ActivationStackScreens } from "../navigation"
import { useOnboardingContext } from "../OnboardingContext"

type ActivationStep =
  | "AcceptTermsOfService"
  | "AnonymizedDataConsent"
  | "ActivateLocation"
  | "ActivateBluetooth"
  | "ActivateExposureNotifications"
  | "NotificationPermissions"
  | "ActivationSummary"

export const toScreen = (step: ActivationStep): ActivationStackScreen => {
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

type ActivationNavigation = {
  activationSteps: ActivationStep[]
  goToNextScreen: (currentStep: ActivationStep) => void
}

export const useNextActivationScreen = (): ActivationNavigation => {
  const {
    displayAcceptTermsOfService,
    enableProductAnalytics,
  } = useConfigurationContext()
  const navigation = useNavigation()
  const { locationPermissions, isBluetoothOn } = usePermissionsContext()
  const { completeOnboarding } = useOnboardingContext()

  const environment = {
    displayAcceptTermsOfService,
    enableProductAnalytics,
    locationPermissions,
    isBluetoothOn,
  }

  const activationSteps = determineActivationSteps(environment)

  const goToNextScreen = (currentStep: ActivationStep) => {
    const currentStepIndex: number | undefined = activationSteps.findIndex(
      (step) => step === currentStep,
    )
    const nextStepIndex = currentStepIndex + 1
    if (nextStepIndex < activationSteps.length) {
      const nextStepName = activationSteps[nextStepIndex]
      const nextScreen = toScreen(nextStepName)
      navigation.navigate(nextScreen)
    } else {
      completeOnboarding()
    }
  }

  return { activationSteps, goToNextScreen }
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
