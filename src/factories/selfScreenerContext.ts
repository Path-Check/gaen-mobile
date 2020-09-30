import { Factory } from "fishery"
import { SelfScreenerContextState } from "../SelfScreenerContext"

export default Factory.define<SelfScreenerContextState>(() => ({
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
}))
