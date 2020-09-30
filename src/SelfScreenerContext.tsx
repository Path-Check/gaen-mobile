import React, {
  FunctionComponent,
  useContext,
  useEffect,
  useState,
  createContext,
} from "react"
import {
  AgeRange,
  EmergencySymptom,
  PrimarySymptom,
  SecondarySymptom,
  OtherSymptom,
  SymptomGroup,
  UnderlyingCondition,
  determineSymptomGroup,
  SelfScreenerAnswers,
} from "./SelfScreener/selfScreener"

export type SelfScreenerContextState = {
  emergencySymptoms: EmergencySymptom[]
  updateEmergencySymptoms: (symptom: EmergencySymptom) => void
  primarySymptoms: PrimarySymptom[]
  updatePrimarySymptoms: (symptom: PrimarySymptom) => void
  secondarySymptoms: SecondarySymptom[]
  updateSecondarySymptoms: (symptom: SecondarySymptom) => void
  otherSymptoms: OtherSymptom[]
  updateOtherSymptoms: (symptom: OtherSymptom) => void
  underlyingConditions: UnderlyingCondition[]
  updateUnderlyingConditions: (condition: UnderlyingCondition) => void
  ageRange: AgeRange | null
  updateAgeRange: (range: AgeRange) => void
  symptomGroup: SymptomGroup | null
}

const initialState = {
  emergencySymptoms: [],
  updateEmergencySymptoms: () => {},
  primarySymptoms: [],
  updatePrimarySymptoms: () => {},
  secondarySymptoms: [],
  updateSecondarySymptoms: () => {},
  otherSymptoms: [],
  updateOtherSymptoms: () => {},
  underlyingConditions: [],
  updateUnderlyingConditions: () => {},
  ageRange: null,
  updateAgeRange: () => {},
  symptomGroup: null,
}

export const SelfScreenerContext = createContext<SelfScreenerContextState>(
  initialState,
)
export const SelfScreenerProvider: FunctionComponent = ({ children }) => {
  const { emergencySymptoms, updateEmergencySymptoms } = useEmergencySymptoms()
  const { primarySymptoms, updatePrimarySymptoms } = usePrimarySymptoms()
  const { secondarySymptoms, updateSecondarySymptoms } = useSecondarySymptoms()
  const { otherSymptoms, updateOtherSymptoms } = useOtherSymptoms()
  const {
    underlyingConditions,
    updateUnderlyingConditions,
  } = useUnderlyingConditions()
  const { ageRange, updateAgeRange } = useAgeRange()
  const { symptomGroup } = useSymptomGroup({
    emergencySymptoms,
    primarySymptoms,
    secondarySymptoms,
    otherSymptoms,
    underlyingConditions,
    ageRange,
  })

  return (
    <SelfScreenerContext.Provider
      value={{
        emergencySymptoms,
        updateEmergencySymptoms,
        primarySymptoms,
        updatePrimarySymptoms,
        secondarySymptoms,
        updateSecondarySymptoms,
        otherSymptoms,
        updateOtherSymptoms,
        underlyingConditions,
        updateUnderlyingConditions,
        ageRange,
        updateAgeRange,
        symptomGroup,
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

const usePrimarySymptoms = () => {
  const [primarySymptoms, setPrimarySymptoms] = useState<PrimarySymptom[]>([])

  const updatePrimarySymptoms = (symptom: PrimarySymptom) => {
    if (primarySymptoms.includes(symptom)) {
      setPrimarySymptoms(primarySymptoms.filter((s) => s !== symptom))
    } else {
      setPrimarySymptoms([...primarySymptoms, symptom])
    }
  }

  return { primarySymptoms, updatePrimarySymptoms }
}

const useSecondarySymptoms = () => {
  const [secondarySymptoms, setSecondarySymptoms] = useState<
    SecondarySymptom[]
  >([])

  const updateSecondarySymptoms = (symptom: SecondarySymptom) => {
    if (secondarySymptoms.includes(symptom)) {
      setSecondarySymptoms(secondarySymptoms.filter((s) => s !== symptom))
    } else {
      setSecondarySymptoms([...secondarySymptoms, symptom])
    }
  }

  return { secondarySymptoms, updateSecondarySymptoms }
}

const useOtherSymptoms = () => {
  const [otherSymptoms, setOtherSymptoms] = useState<OtherSymptom[]>([])

  const updateOtherSymptoms = (symptom: OtherSymptom) => {
    if (otherSymptoms.includes(symptom)) {
      setOtherSymptoms(otherSymptoms.filter((s) => s !== symptom))
    } else {
      setOtherSymptoms([...otherSymptoms, symptom])
    }
  }

  return { otherSymptoms, updateOtherSymptoms }
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

const useSymptomGroup = ({
  emergencySymptoms,
  primarySymptoms,
  secondarySymptoms,
  otherSymptoms,
  underlyingConditions,
  ageRange,
}: SelfScreenerAnswers) => {
  const [symptomGroup, setSymptomGroup] = useState<SymptomGroup | null>(null)

  useEffect(() => {
    setSymptomGroup(
      determineSymptomGroup({
        emergencySymptoms,
        primarySymptoms,
        secondarySymptoms,
        otherSymptoms,
        underlyingConditions,
        ageRange,
      }),
    )
  }, [
    emergencySymptoms,
    primarySymptoms,
    secondarySymptoms,
    otherSymptoms,
    underlyingConditions,
    ageRange,
  ])

  return { symptomGroup }
}

export const useSelfScreenerContext = (): SelfScreenerContextState => {
  const context = useContext(SelfScreenerContext)
  if (context === undefined) {
    throw new Error("SelfScreenerContext must be used with a provider")
  }

  return context
}
