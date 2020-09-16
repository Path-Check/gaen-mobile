import React, { FunctionComponent, useState, useEffect } from "react"
import { createContext, useContext } from "react"

import {
  determineHealthRecommendation,
  Symptom,
  HealthRecommendation,
} from "./symptoms"

type SymptomCheckerContextState = {
  symptoms: Symptom[]
  updateSymptoms: (newSymptoms: Symptom[]) => void
  healthRecommendation: HealthRecommendation
}

export const SymptomCheckerContext = createContext<SymptomCheckerContextState>({
  symptoms: [],
  updateSymptoms: () => {},
  healthRecommendation: HealthRecommendation.FollowHAGuidance,
})

const SymptomCheckerProvider: FunctionComponent = ({ children }) => {
  const [symptoms, setSymptoms] = useState<Symptom[]>([])
  const [healthRecommendation, setHealthRecommendation] = useState<
    HealthRecommendation
  >(HealthRecommendation.FollowHAGuidance)

  const updateSymptoms = (newSymptoms: Symptom[]) => {
    setSymptoms(newSymptoms)
  }

  useEffect(() => {
    setHealthRecommendation(determineHealthRecommendation(symptoms))
  }, [setHealthRecommendation, symptoms])

  return (
    <SymptomCheckerContext.Provider
      value={{ symptoms, updateSymptoms, healthRecommendation }}
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
