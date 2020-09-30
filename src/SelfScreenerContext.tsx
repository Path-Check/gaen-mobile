import React, {
  FunctionComponent,
  useContext,
  useState,
  createContext,
} from "react"
import {
  AgeRange,
  EmergencySymptom,
  GeneralSymptom,
  UnderlyingCondition,
} from "./SelfScreener/selfScreener"

export type SelfScreenerContextState = {
  emergencySymptoms: EmergencySymptom[]
  updateEmergencySymptoms: (symptom: EmergencySymptom) => void
  generalSymptoms: GeneralSymptom[]
  updateGeneralSymptoms: (symptom: GeneralSymptom) => void
  underlyingConditions: UnderlyingCondition[]
  updateUnderlyingConditions: (condition: UnderlyingCondition) => void
  ageRange: AgeRange | null
  updateAgeRange: (range: AgeRange) => void
}

const initialState = {
  emergencySymptoms: [],
  updateEmergencySymptoms: () => {},
  generalSymptoms: [],
  updateGeneralSymptoms: () => {},
  underlyingConditions: [],
  updateUnderlyingConditions: () => {},
  ageRange: null,
  updateAgeRange: () => {},
}

export const SelfScreenerContext = createContext<SelfScreenerContextState>(
  initialState,
)
export const SelfScreenerProvider: FunctionComponent = ({ children }) => {
  const { emergencySymptoms, updateEmergencySymptoms } = useEmergencySymptoms()
  const { generalSymptoms, updateGeneralSymptoms } = useGeneralSymptoms()
  const {
    underlyingConditions,
    updateUnderlyingConditions,
  } = useUnderlyingConditions()
  const { ageRange, updateAgeRange } = useAgeRange()

  return (
    <SelfScreenerContext.Provider
      value={{
        emergencySymptoms,
        updateEmergencySymptoms,
        generalSymptoms,
        updateGeneralSymptoms,
        underlyingConditions,
        updateUnderlyingConditions,
        ageRange,
        updateAgeRange,
      }}
    >
      {children}
    </SelfScreenerContext.Provider>
  )
}

const useAgeRange = () => {
  const [ageRange, setAgeRange] = useState<AgeRange | null>(null)

  const updateAgeRange = (range: AgeRange) => {
    setAgeRange(range)
  }
  return { ageRange, updateAgeRange }
}

const useEmergencySymptoms = () => {
  const [emergencySymptoms, setEmergencySymptoms] = useState<
    EmergencySymptom[]
  >([])

  const updateEmergencySymptoms = (symptom: EmergencySymptom) => {
    if (emergencySymptoms.includes(symptom)) {
      setEmergencySymptoms(emergencySymptoms.filter((s) => s !== symptom))
    } else {
      setEmergencySymptoms([...emergencySymptoms, symptom])
    }
  }

  return { emergencySymptoms, updateEmergencySymptoms }
}

const useGeneralSymptoms = () => {
  const [generalSymptoms, setGeneralSymptoms] = useState<GeneralSymptom[]>([])

  const updateGeneralSymptoms = (symptom: GeneralSymptom) => {
    if (generalSymptoms.includes(symptom)) {
      setGeneralSymptoms(generalSymptoms.filter((s) => s !== symptom))
    } else {
      setGeneralSymptoms([...generalSymptoms, symptom])
    }
  }

  return { generalSymptoms, updateGeneralSymptoms }
}

const useUnderlyingConditions = () => {
  const [underlyingConditions, setUnderlyingConditions] = useState<
    UnderlyingCondition[]
  >([])

  const updateUnderlyingConditions = (condition: UnderlyingCondition) => {
    if (underlyingConditions.includes(condition)) {
      setUnderlyingConditions(
        underlyingConditions.filter((s) => s !== condition),
      )
    } else {
      setUnderlyingConditions([...underlyingConditions, condition])
    }
  }

  return { underlyingConditions, updateUnderlyingConditions }
}

export const useSelfScreenerContext = (): SelfScreenerContextState => {
  const context = useContext(SelfScreenerContext)
  if (context === undefined) {
    throw new Error("SelfScreenerContext must be used with a provider")
  }

  return context
}
