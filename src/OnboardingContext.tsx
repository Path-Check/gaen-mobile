import React, {
  createContext,
  useState,
  useContext,
  FunctionComponent,
} from "react"

import { StorageUtils } from "./utils"

export const determineIsOnboardingComplete = async (): Promise<boolean> => {
  return await StorageUtils.getIsOnboardingComplete()
}

export const OnboardingContext = createContext<
  OnboardingContextState | undefined
>(undefined)

export interface OnboardingContextState {
  isOnboardingComplete: boolean
  completeOnboarding: () => void
  resetOnboarding: () => void
}

interface OnboardingProviderProps {
  userHasCompletedOnboarding: boolean
}

export const OnboardingProvider: FunctionComponent<OnboardingProviderProps> = ({
  children,
  userHasCompletedOnboarding,
}) => {
  const [isOnboardingComplete, setIsOnboardingComplete] = useState<boolean>(
    userHasCompletedOnboarding,
  )

  const completeOnboarding = () => {
    StorageUtils.setIsOnboardingComplete()
    setIsOnboardingComplete(true)
  }

  const resetOnboarding = () => {
    StorageUtils.removeIsOnboardingComplete()
    setIsOnboardingComplete(false)
  }

  return (
    <OnboardingContext.Provider
      value={{
        isOnboardingComplete,
        completeOnboarding,
        resetOnboarding,
      }}
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
