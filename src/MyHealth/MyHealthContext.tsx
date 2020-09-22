import React, { FunctionComponent, useState, useEffect } from "react"
import { createContext, useContext } from "react"

import {
  determineHealthAssessment,
  Symptom,
  HealthAssessment,
} from "./symptoms"

export type MyHealthContextState = {
  symptoms: Symptom[]
  updateSymptoms: (newSymptoms: Symptom[]) => void
  healthAssessment: HealthAssessment
}

export const MyHealthContext = createContext<MyHealthContextState>({
  symptoms: [],
  updateSymptoms: () => {},
  healthAssessment: HealthAssessment.NotAtRisk,
})

export const MyHealthProvider: FunctionComponent = ({ children }) => {
  const [symptoms, setSymptoms] = useState<Symptom[]>([])
  const [healthAssessment, setHealthAssessment] = useState<HealthAssessment>(
    HealthAssessment.NotAtRisk,
  )

  const updateSymptoms = (newSymptoms: Symptom[]) => {
    setSymptoms(newSymptoms)
  }

  useEffect(() => {
    setHealthAssessment(determineHealthAssessment(symptoms))
  }, [setHealthAssessment, symptoms])

  return (
    <MyHealthContext.Provider
      value={{ symptoms, updateSymptoms, healthAssessment }}
    >
      {children}
    </MyHealthContext.Provider>
  )
}

export const useMyHealthContext = (): MyHealthContextState => {
  const context = useContext(MyHealthContext)
  if (context === undefined) {
    throw new Error("MyHealthContext must be used with a provider")
  }
  return context
}
