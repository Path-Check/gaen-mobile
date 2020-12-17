import { useNavigation } from "@react-navigation/native"

import { useConfigurationContext } from "../ConfigurationContext"
import { OnboardingRoutes, Stacks, ModalStackScreens } from "../navigation"

type OnboardingStep =
  | "Welcome"
  | "AppTransition"
  | "AgeVerification"
  | "HowItWorks"

type OnboardingScreen =
  | "Welcome"
  | "AppTransition"
  | "AgeVerification"
  | "HowItWorks"
const OnboardingScreens: { [key in OnboardingScreen]: OnboardingScreen } = {
  Welcome: OnboardingRoutes.Welcome as OnboardingStep,
  AppTransition: OnboardingRoutes.AppTransition as OnboardingStep,
  AgeVerification: ModalStackScreens.AgeVerification as OnboardingStep,
  HowItWorks: Stacks.HowItWorks as OnboardingScreen,
}

export const toScreen = (step: OnboardingStep): OnboardingScreen => {
  switch (step) {
    case "Welcome":
      return OnboardingScreens.Welcome
    case "AppTransition":
      return OnboardingScreens.AppTransition
    case "AgeVerification":
      return OnboardingScreens.AgeVerification
    case "HowItWorks":
      return OnboardingScreens.HowItWorks
  }
}

type OnboardingNavigation = {
  onboardingSteps: OnboardingStep[]
  goToNextScreenFrom: (currentStep: OnboardingStep) => void
}

export const useOnboardingNavigation = (): OnboardingNavigation => {
  const {
    displayAgeVerification,
    displayAppTransition,
  } = useConfigurationContext()
  const navigation = useNavigation()

  const environment = {
    displayAgeVerification,
    displayAppTransition,
  }

  const onboardingSteps = determineOnboardingSteps(environment)

  const goToNextScreenFrom = (currentStep: OnboardingStep) => {
    const currentStepIndex: number | undefined = onboardingSteps.findIndex(
      (step) => step === currentStep,
    )
    const nextStepIndex = currentStepIndex + 1
    if (nextStepIndex < onboardingSteps.length) {
      const nextStepName = onboardingSteps[nextStepIndex]
      const nextScreen = toScreen(nextStepName)
      navigation.navigate(nextScreen)
    } else {
      navigation.navigate(Stacks.Activation)
    }
  }

  return { onboardingSteps, goToNextScreenFrom }
}

export type Environment = {
  displayAgeVerification: boolean
  displayAppTransition: boolean
}

export const determineOnboardingSteps = ({
  displayAgeVerification,
  displayAppTransition,
}: Environment): OnboardingStep[] => {
  const onboardingSteps: OnboardingStep[] = []

  displayAppTransition && onboardingSteps.push("AppTransition")
  displayAgeVerification && onboardingSteps.push("AgeVerification")

  return onboardingSteps
}
