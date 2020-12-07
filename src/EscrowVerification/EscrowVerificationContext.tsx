import React, {
  FunctionComponent,
  createContext,
  useState,
  useContext,
} from "react"

import { ExposureKey } from "../exposureKey"

type Token = string
type Key = string

export interface EscrowVerificationContextState {
  certificate: Token | null
  hmacKey: Key | null
  exposureKeys: ExposureKey[]
  setExposureKeys: (keys: ExposureKey[]) => void
  setExposureSubmissionCredentials: (certificate: Token, hmacKey: Key) => void
}

export const EscrowVerificationContext = createContext<
  EscrowVerificationContextState | undefined
>(undefined)

export const EscrowVerificationProvider: FunctionComponent = ({ children }) => {
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

  return (
    <EscrowVerificationContext.Provider
      value={{
        hmacKey,
        certificate,
        exposureKeys,
        setExposureKeys,
        setExposureSubmissionCredentials,
      }}
    >
      {children}
    </EscrowVerificationContext.Provider>
  )
}

export const useEscrowVerificationContext = (): EscrowVerificationContextState => {
  const context = useContext(EscrowVerificationContext)
  if (context === undefined) {
    throw new Error("EscrowVerificationContext must be used with a provider")
  }
  return context
}
