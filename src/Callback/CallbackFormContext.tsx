import { createContext, useContext } from "react"

type CallbackFormContextState = {
  callBackRequestCompleted: () => void
}

export const CallbackFormContext = createContext<CallbackFormContextState>({
  callBackRequestCompleted: () => {},
})

export const useCallbackFormContext = (): CallbackFormContextState => {
  const context = useContext(CallbackFormContext)
  if (context === undefined) {
    throw new Error("CallbackFormContext must be used with a provider")
  }
  return context
}
