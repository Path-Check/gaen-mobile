import React, {
  FunctionComponent,
  createContext,
  useState,
  useContext,
} from "react"

type Posix = number

export interface EscrowVerificationContextState {
  testDate: Posix
  setTestDate: (testDate: Posix) => void
}

export const EscrowVerificationContext = createContext<
  EscrowVerificationContextState | undefined
>(undefined)

export const EscrowVerificationProvider: FunctionComponent = ({ children }) => {
  const [testDate, setTestDate] = useState(Date.now)

  return (
    <EscrowVerificationContext.Provider
      value={{
        testDate,
        setTestDate,
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
