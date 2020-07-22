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

  const setOnboardingToComplete = () => {
    StorageUtils.setIsOnboardingComplete()
    setOnboardingIsComplete(true)
  }

  return (
    <OnboardingContext.Provider
      value={{ onboardingIsComplete, setOnboardingToComplete }}
    >
      {children}
    </OnboardingContext.Provider>
  )
}

const OnboardingContext = createContext<OnboardingContextState | undefined>(
  undefined,
)

interface OnboardingContextState {
  onboardingIsComplete: boolean
  setOnboardingToComplete: () => void
}

export const useOnboardingContext = (): OnboardingContextState => {
  const context = useContext(OnboardingContext)
  if (context === undefined) {
    throw new Error("OnboardingContext must be used with a provider")
  }
  return context
}
