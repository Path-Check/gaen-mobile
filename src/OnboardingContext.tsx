import React, {
  createContext,
  useState,
  useContext,
  FunctionComponent,
} from "react"

import { StorageUtils } from "./utils"

export const onboardingHasBeenCompleted = async (): Promise<boolean> => {
  return await StorageUtils.getIsOnboardingComplete()
}

const OnboardingContext = createContext<OnboardingContextState | undefined>(
  undefined,
)

interface OnboardingContextState {
  onboardingIsComplete: boolean
  completeOnboarding: () => void
  resetOnboarding: () => void
}

interface OnboardingProviderProps {
  userHasCompletedOboarding: boolean
}

export const OnboardingProvider: FunctionComponent<OnboardingProviderProps> = ({
  children,
  userHasCompletedOboarding,
}) => {
  const [onboardingIsComplete, setOnboardingIsComplete] = useState<boolean>(
    userHasCompletedOboarding,
  )

  const completeOnboarding = () => {
    StorageUtils.setIsOnboardingComplete()
    setOnboardingIsComplete(true)
  }

  const resetOnboarding = () => {
    StorageUtils.removeIsOnboardingComplete()
    setOnboardingIsComplete(false)
  }

  return (
    <OnboardingContext.Provider
      value={{ onboardingIsComplete, completeOnboarding, resetOnboarding }}
    >
      {children}
    </OnboardingContext.Provider>
  )
}

export const useOnboardingContext = (): OnboardingContextState => {
  const context = useContext(OnboardingContext)
  if (context === undefined) {
    throw new Error("OnboardingContext must be used with a provider")
  }
  return context
}
