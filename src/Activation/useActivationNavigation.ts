import { Platform } from "react-native"
import { useNavigation } from "@react-navigation/native"

import { useConfigurationContext } from "../ConfigurationContext"
import { usePermissionsContext } from "../Device/PermissionsContext"
import { LocationPermissions } from "../Device/useLocationPermissions"
import { ActivationStackScreen, ActivationStackScreens } from "../navigation"
import { useOnboardingContext } from "../OnboardingContext"

type ActivationStep =
  | "AcceptTermsOfService"
  | "ProductAnalyticsConsent"
  | "ActivateLocation"
  | "ActivateBluetooth"
  | "ActivateExposureNotifications"
  | "NotificationPermissions"
  | "ActivationSummary"

export const toScreen = (step: ActivationStep): ActivationStackScreen => {
  switch (step) {
    case "AcceptTermsOfService":
      return ActivationStackScreens.AcceptTermsOfService
    case "ProductAnalyticsConsent":
      return ActivationStackScreens.ProductAnalyticsConsent
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
  goToNextScreenFrom: (currentStep: ActivationStep) => void
}

export const useActivationNavigation = (): ActivationNavigation => {
  const {
    displayAcceptTermsOfService,
    enableProductAnalytics,
  } = useConfigurationContext()
  const navigation = useNavigation()
  const { locationPermissions } = usePermissionsContext()
  const { completeOnboarding } = useOnboardingContext()

  const environment = {
    displayAcceptTermsOfService,
    enableProductAnalytics,
    locationPermissions,
  }

  const activationSteps = determineActivationSteps(environment)

  const goToNextScreenFrom = (currentStep: ActivationStep) => {
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

  return { activationSteps, goToNextScreenFrom }
}

export type Environment = {
  locationPermissions: LocationPermissions
  displayAcceptTermsOfService: boolean
  enableProductAnalytics: boolean
}

export const determineActivationSteps = ({
  displayAcceptTermsOfService,
  enableProductAnalytics,
  locationPermissions,
}: Environment): ActivationStep[] => {
  const isLocationRequiredAndOff = locationPermissions === "RequiredOff"

  const activationSteps: ActivationStep[] = []

  displayAcceptTermsOfService && activationSteps.push("AcceptTermsOfService")
  enableProductAnalytics && activationSteps.push("ProductAnalyticsConsent")
  isLocationRequiredAndOff && activationSteps.push("ActivateLocation")
  activationSteps.push("ActivateExposureNotifications")
  Platform.OS === "ios" && activationSteps.push("NotificationPermissions")
  activationSteps.push("ActivationSummary")

  return activationSteps
}
