import React, {
  createContext,
  useState,
  useContext,
  FunctionComponent,
} from "react"

import { StorageUtils } from "./utils"
import { Stack, Stacks } from "./navigation"

export const onboardingHasBeenCompleted = async (): Promise<boolean> => {
  return await StorageUtils.getIsOnboardingComplete()
}

export const OnboardingContext = createContext<
  OnboardingContextState | undefined
>(undefined)

export interface OnboardingContextState {
  isOnboardingComplete: boolean
  completeOnboarding: () => void
  resetOnboarding: () => void
  destinationAfterComplete: Stack
  updateDestinationAfterComplete: (stack: Stack) => void
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
  const [destinationAfterComplete, setDestinationAfterComplete] = useState<
    Stack
  >(Stacks.Activation)

  const completeOnboarding = () => {
    StorageUtils.setIsOnboardingComplete()
    setIsOnboardingComplete(true)
  }

  const resetOnboarding = () => {
    StorageUtils.removeIsOnboardingComplete()
    setDestinationAfterComplete(Stacks.Activation)
    setIsOnboardingComplete(false)
  }

  const updateDestinationAfterComplete = (stack: Stack) => {
    setDestinationAfterComplete(stack)
  }

  return (
    <OnboardingContext.Provider
      value={{
        isOnboardingComplete,
        completeOnboarding,
        resetOnboarding,
        destinationAfterComplete,
        updateDestinationAfterComplete,
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
