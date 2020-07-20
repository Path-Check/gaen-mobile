import React, {
  createContext,
  useState,
  useContext,
  FunctionComponent,
} from "react"

import { SetStoreData, GetStoreData } from "./utils/General"

const ONBOARDING_COMPLETE = "ONBOARDING_COMPLETE"

export const isOnboardingComplete = async (): Promise<boolean> => {
  return GetStoreData(ONBOARDING_COMPLETE)
}

interface OnboardingContextState {
  isComplete: boolean
  setOnboardingIsComplete: () => void
}

const OnboardingContext = createContext<OnboardingContextState | undefined>(
  undefined,
)

interface OnboardingProviderProps {
  onboardingIsComplete: boolean
}

export const OnboardingProvider: FunctionComponent<OnboardingProviderProps> = ({
  children,
  onboardingIsComplete,
}) => {
  const [isComplete, setIsComplete] = useState<boolean>(onboardingIsComplete)

  const setOnboardingIsComplete = () => {
    SetStoreData(ONBOARDING_COMPLETE, "true")
    setIsComplete(true)
  }

  return (
    <OnboardingContext.Provider value={{ isComplete, setOnboardingIsComplete }}>
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
