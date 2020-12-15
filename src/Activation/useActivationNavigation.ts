import { Platform } from "react-native"
import { useNavigation } from "@react-navigation/native"

import { useConfigurationContext } from "../ConfigurationContext"
import {
  ENPermissionStatus,
  usePermissionsContext,
} from "../Device/PermissionsContext"
import {
  ActivationStackScreen,
  ActivationStackScreens,
  Stacks,
} from "../navigation"
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
  const { exposureNotifications } = usePermissionsContext()
  const { completeOnboarding } = useOnboardingContext()

  const environment = {
    displayAcceptTermsOfService,
    enableProductAnalytics,
    exposureNotificationsStatus: exposureNotifications.status,
  }

  const activationSteps = determineActivationSteps(environment)

  const goToNextScreenFrom = async (currentStep: ActivationStep) => {
    const currentStepIndex: number | undefined = activationSteps.findIndex(
      (step) => step === currentStep,
    )
    const nextStepIndex = currentStepIndex + 1
    if (nextStepIndex < activationSteps.length) {
      const nextStepName = activationSteps[nextStepIndex]
      const nextScreen = toScreen(nextStepName)
      navigation.navigate(nextScreen)
    } else {
      await completeOnboarding()
      navigation.navigate("App", { screen: Stacks.Home })
    }
  }

  return { activationSteps, goToNextScreenFrom }
}

export type Environment = {
  exposureNotificationsStatus: ENPermissionStatus
  displayAcceptTermsOfService: boolean
  enableProductAnalytics: boolean
}

export const determineActivationSteps = ({
  displayAcceptTermsOfService,
  enableProductAnalytics,
  exposureNotificationsStatus,
}: Environment): ActivationStep[] => {
  const activationSteps: ActivationStep[] = []

  displayAcceptTermsOfService && activationSteps.push("AcceptTermsOfService")
  enableProductAnalytics && activationSteps.push("ProductAnalyticsConsent")
  exposureNotificationsStatus === "LocationOffAndRequired" &&
    activationSteps.push("ActivateLocation")
  activationSteps.push("ActivateExposureNotifications")
  Platform.OS === "ios" && activationSteps.push("NotificationPermissions")
  activationSteps.push("ActivationSummary")

  return activationSteps
}
