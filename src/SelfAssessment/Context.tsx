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
  SelfAssessmentAnswers,
  GeneralSymptom,
} from "./selfAssessment"

export type SelfAssessmentContextState = {
  emergencySymptoms: EmergencySymptom[]
  primarySymptoms: PrimarySymptom[]
  secondarySymptoms: SecondarySymptom[]
  otherSymptoms: OtherSymptom[]
  underlyingConditions: UnderlyingCondition[]
  clearSymptoms: () => void
  updateSymptoms: (symptom: GeneralSymptom) => void
  updateUnderlyingConditions: (condition: UnderlyingCondition) => void
  ageRange: AgeRange | null
  updateAgeRange: (range: AgeRange) => void
  symptomGroup: SymptomGroup | null
}

const initialState = {
  emergencySymptoms: [],
  primarySymptoms: [],
  secondarySymptoms: [],
  otherSymptoms: [],
  clearSymptoms: () => {},
  updateSymptoms: () => {},
  underlyingConditions: [],
  updateUnderlyingConditions: () => {},
  ageRange: null,
  updateAgeRange: () => {},
  symptomGroup: null,
}

export const SelfAssessmentContext = createContext<SelfAssessmentContextState>(
  initialState,
)
export const SelfAssessmentProvider: FunctionComponent = ({ children }) => {
  const {
    emergencySymptoms,
    updateEmergencySymptoms,
    clearEmergencySymptoms,
  } = useEmergencySymptoms()
  const {
    primarySymptoms,
    updatePrimarySymptoms,
    clearPrimarySymptoms,
  } = usePrimarySymptoms()
  const {
    secondarySymptoms,
    updateSecondarySymptoms,
    clearSecondarySymptoms,
  } = useSecondarySymptoms()
  const {
    otherSymptoms,
    updateOtherSymptoms,
    clearOtherSymptoms,
  } = useOtherSymptoms()
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

  const updateSymptoms = (symptom: GeneralSymptom) => {
    if (isEmergencySymptom(symptom)) {
      return updateEmergencySymptoms(symptom)
    }

    if (isPrimarySymptom(symptom)) {
      return updatePrimarySymptoms(symptom)
    }

    if (isSecondarySymptom(symptom)) {
      return updateSecondarySymptoms(symptom)
    }

    if (isOtherSymptom(symptom)) {
      return updateOtherSymptoms(symptom)
    }
  }

  const clearSymptoms = () => {
    clearEmergencySymptoms()
    clearPrimarySymptoms()
    clearSecondarySymptoms()
    clearOtherSymptoms()
  }

  return (
    <SelfAssessmentContext.Provider
      value={{
        emergencySymptoms,
        primarySymptoms,
        secondarySymptoms,
        otherSymptoms,
        updateSymptoms,
        clearSymptoms,
        underlyingConditions,
        updateUnderlyingConditions,
        ageRange,
        updateAgeRange,
        symptomGroup,
      }}
    >
      {children}
    </SelfAssessmentContext.Provider>
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
  const clearEmergencySymptoms = () => {
    setEmergencySymptoms([])
  }

  return { emergencySymptoms, updateEmergencySymptoms, clearEmergencySymptoms }
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

  const clearPrimarySymptoms = () => {
    setPrimarySymptoms([])
  }

  return { primarySymptoms, updatePrimarySymptoms, clearPrimarySymptoms }
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

  const clearSecondarySymptoms = () => {
    setSecondarySymptoms([])
  }

  return { secondarySymptoms, updateSecondarySymptoms, clearSecondarySymptoms }
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

  const clearOtherSymptoms = () => {
    setOtherSymptoms([])
  }

  return { otherSymptoms, updateOtherSymptoms, clearOtherSymptoms }
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
}: SelfAssessmentAnswers) => {
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

export const useSelfAssessmentContext = (): SelfAssessmentContextState => {
  const context = useContext(SelfAssessmentContext)
  if (context === undefined) {
    throw new Error("SelfAssessmentContext must be used with a provider")
  }

  return context
}

const isEmergencySymptom = (
  symptom: GeneralSymptom,
): symptom is EmergencySymptom => {
  return (
    symptom === EmergencySymptom.SEVERE_DIFFICULTY_BREATHING ||
    symptom === EmergencySymptom.CHEST_PAIN ||
    symptom === EmergencySymptom.DISORIENTATION ||
    symptom === EmergencySymptom.LIGHTHEADEDNESS
  )
}

const isPrimarySymptom = (
  symptom: GeneralSymptom,
): symptom is PrimarySymptom => {
  return (
    symptom === PrimarySymptom.COUGH ||
    symptom === PrimarySymptom.FEVER_OR_CHILLS ||
    symptom === PrimarySymptom.MODERATE_DIFFICULTY_BREATHING
  )
}

const isSecondarySymptom = (
  symptom: GeneralSymptom,
): symptom is SecondarySymptom => {
  return (
    symptom === SecondarySymptom.ACHING ||
    symptom === SecondarySymptom.LOSS_OF_SMELL_TASTE_APPETITE
  )
}

const isOtherSymptom = (symptom: GeneralSymptom): symptom is OtherSymptom => {
  return (
    symptom === OtherSymptom.OTHER ||
    symptom === OtherSymptom.VOMITING_OR_DIARRHEA
  )
}
