import React, { FunctionComponent, useState } from "react"
import { createContext, useContext } from "react"

type Symptom = string

type SymptomCheckerContextState = {
  symptoms: Symptom[]
  updateSymptoms: (newSymptoms: Symptom[]) => void
}

export const SymptomCheckerContext = createContext<SymptomCheckerContextState>({
  symptoms: [],
  updateSymptoms: () => {},
})

const SymptomCheckerProvider: FunctionComponent = ({ children }) => {
  const [symptoms, setSymptoms] = useState<Symptom[]>([])

  const updateSymptoms = (newSymptoms: Symptom[]) => {
    setSymptoms(newSymptoms)
  }

  return (
    <SymptomCheckerContext.Provider value={{ symptoms, updateSymptoms }}>
      {children}
    </SymptomCheckerContext.Provider>
  )
}

const useSymptomCheckerContext = (): SymptomCheckerContextState => {
  const context = useContext(SymptomCheckerContext)
  if (context === undefined) {
    throw new Error("SymptomCheckerContext must be used with a provider")
  }
  return context
}

export { SymptomCheckerProvider, useSymptomCheckerContext }
