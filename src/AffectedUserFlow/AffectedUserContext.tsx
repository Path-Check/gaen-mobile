import React, {
  FunctionComponent,
  createContext,
  useState,
  useContext,
} from "react"
import { useNavigation } from "@react-navigation/native"

import { ExposureKey } from "../exposureKey"
import { useOnboardingContext } from "../OnboardingContext"
import { Stacks, WelcomeStackScreens } from "../navigation"

type Token = string
type Key = string

interface AffectedUserContextState {
  certificate: Token | null
  hmacKey: Key | null
  exposureKeys: ExposureKey[]
  setExposureKeys: (keys: ExposureKey[]) => void
  setExposureSubmissionCredentials: (certificate: Token, hmacKey: Key) => void
  navigateOutOfStack: () => void
}

export const AffectedUserContext = createContext<
  AffectedUserContextState | undefined
>(undefined)

export const AffectedUserProvider: FunctionComponent = ({ children }) => {
  const { isOnboardingComplete } = useOnboardingContext()
  const navigation = useNavigation()

  const [exposureKeys, setExposureKeys] = useState<ExposureKey[]>([])
  const [hmacKey, setHmacKey] = useState<Key | null>(null)
  const [certificate, setCertificate] = useState<Token | null>(null)

  const setExposureSubmissionCredentials = (
    certificate: Token,
    hmacKey: Key,
  ) => {
    setCertificate(certificate)
    setHmacKey(hmacKey)
  }

  const navigateOutOfStack = () => {
    if (isOnboardingComplete) {
      navigation.navigate("App", { screen: Stacks.Home })
    } else {
      navigation.navigate(WelcomeStackScreens.Welcome)
    }
  }

  return (
    <AffectedUserContext.Provider
      value={{
        hmacKey,
        certificate,
        exposureKeys,
        setExposureKeys,
        setExposureSubmissionCredentials,
        navigateOutOfStack,
      }}
    >
      {children}
    </AffectedUserContext.Provider>
  )
}

export const useAffectedUserContext = (): AffectedUserContextState => {
  const context = useContext(AffectedUserContext)
  if (context === undefined) {
    throw new Error("AffectedUserContext must be used with a provider")
  }
  return context
}
