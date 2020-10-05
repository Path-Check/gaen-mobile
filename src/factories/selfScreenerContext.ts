import { Factory } from "fishery"
import { SelfScreenerContextState } from "../SelfScreenerContext"

export default Factory.define<SelfScreenerContextState>(() => ({
  emergencySymptoms: [],
  primarySymptoms: [],
  secondarySymptoms: [],
  otherSymptoms: [],
  updateSymptoms: () => {},
  clearSymptoms: () => {},
  underlyingConditions: [],
  updateUnderlyingConditions: () => {},
  ageRange: null,
  updateAgeRange: () => {},
  symptomGroup: null,
}))
