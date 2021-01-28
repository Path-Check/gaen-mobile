import React, {
  FunctionComponent,
  createContext,
  useState,
  useContext,
} from "react"
import { CommonActions, useNavigation } from "@react-navigation/native"

import { ExposureKey } from "../exposureKey"
import { Stacks, OnboardingRoutes } from "../navigation"

type Token = string
type Key = string
type Posix = number

export interface AffectedUserContextState {
  certificate: Token | null
  hmacKey: Key | null
  exposureKeys: ExposureKey[]
  setExposureKeys: (keys: ExposureKey[]) => void
  setExposureSubmissionCredentials: (certificate: Token, hmacKey: Key) => void
  navigateOutOfStack: () => void
  linkCode: string | undefined
  setLinkCode: (linkCode: string | undefined) => void
  symptomOnsetDate: Posix | null
  setSymptomOnsetDate: (symptomOnsetDate: Posix | null) => void
}

interface AffectedUserProviderProps {
  isOnboardingComplete: boolean
}

export const AffectedUserContext = createContext<
  AffectedUserContextState | undefined
>(undefined)

export const AffectedUserProvider: FunctionComponent<AffectedUserProviderProps> = ({
  children,
  isOnboardingComplete,
}) => {
  const navigation = useNavigation()

  const [exposureKeys, setExposureKeys] = useState<ExposureKey[]>([])
  const [hmacKey, setHmacKey] = useState<Key | null>(null)
  const [certificate, setCertificate] = useState<Token | null>(null)
  const [linkCode, setLinkCode] = useState<string | undefined>(undefined)

  const [symptomOnsetDate, setSymptomOnsetDate] = useState<Posix | null>(null)

  const setExposureSubmissionCredentials = (
    certificate: Token,
    hmacKey: Key,
  ) => {
    setCertificate(certificate)
    setHmacKey(hmacKey)
  }

  const navigateOutOfStack = () => {
    if (linkCode) {
      const route = isOnboardingComplete ? "App" : OnboardingRoutes.Welcome
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{ name: route }],
        }),
      )
    } else {
      navigation.navigate(Stacks.Home)
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
        linkCode,
        setLinkCode,
        symptomOnsetDate,
        setSymptomOnsetDate,
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
