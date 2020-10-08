import { Factory } from "fishery"
import { SelfAssessmentContextState } from "../SelfAssessmentContext"

export default Factory.define<SelfAssessmentContextState>(() => ({
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
