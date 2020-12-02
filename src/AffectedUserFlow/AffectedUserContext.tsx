import React, {
  FunctionComponent,
  createContext,
  useState,
  useContext,
} from "react"
import { CommonActions } from "@react-navigation/native"

import { ExposureKey } from "../exposureKey"

type Token = string
type Key = string

interface AffectedUserContextState {
  certificate: Token | null
  hmacKey: Key | null
  exposureKeys: ExposureKey[]
  setExposureKeys: (keys: ExposureKey[]) => void
  setExposureSubmissionCredentials: (certificate: Token, hmacKey: Key) => void
  toHome: (homeRouteName: string, navigation: Readonly<any>) => void
}

export const AffectedUserContext = createContext<
  AffectedUserContextState | undefined
>(undefined)

export const AffectedUserProvider: FunctionComponent = ({ children }) => {
  const [exposureKeys, setExposureKeys] = useState<ExposureKey[]>([])
  const [hmacKey, setHmacKey] = useState<Key | null>(null)
  const [certificate, setCertificate] = useState<Token | null>(null)
  // Clears routes so "App" route can be first and prevent strange re-render behavior.
  // navigation object on the provider does not have params, so it requires the navigation object at the screen level.
  const toHome = (homeRouteName: string, navigation: Readonly<any>) =>
  navigation.dispatch((state: Readonly<any>) => {
    if (state.routes[0].params) {
      return CommonActions.reset({
        index: 1,
        routes: [{ name: "App" }],
      })
    }
    return CommonActions.navigate(homeRouteName)
  })

  const setExposureSubmissionCredentials = (
    certificate: Token,
    hmacKey: Key,
  ) => {
    setCertificate(certificate)
    setHmacKey(hmacKey)
  }

  return (
    <AffectedUserContext.Provider
      value={{
        hmacKey,
        certificate,
        exposureKeys,
        setExposureKeys,
        setExposureSubmissionCredentials,
        toHome
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
