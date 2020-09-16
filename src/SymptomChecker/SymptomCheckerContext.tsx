import React, { FunctionComponent, useState, useEffect } from "react"
import { createContext, useContext } from "react"

import {
  determineHealthAssessment,
  Symptom,
  HealthAssessment,
} from "./symptoms"

type SymptomCheckerContextState = {
  symptoms: Symptom[]
  updateSymptoms: (newSymptoms: Symptom[]) => void
  healthAssessment: HealthAssessment
}

export const SymptomCheckerContext = createContext<SymptomCheckerContextState>({
  symptoms: [],
  updateSymptoms: () => {},
  healthAssessment: HealthAssessment.FollowHAGuidance,
})

const SymptomCheckerProvider: FunctionComponent = ({ children }) => {
  const [symptoms, setSymptoms] = useState<Symptom[]>([])
  const [healthAssessment, setHealthAssessment] = useState<HealthAssessment>(
    HealthAssessment.FollowHAGuidance,
  )

  const updateSymptoms = (newSymptoms: Symptom[]) => {
    setSymptoms(newSymptoms)
  }

  useEffect(() => {
    setHealthAssessment(determineHealthAssessment(symptoms))
  }, [setHealthAssessment, symptoms])

  return (
    <SymptomCheckerContext.Provider
      value={{ symptoms, updateSymptoms, healthAssessment }}
    >
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
