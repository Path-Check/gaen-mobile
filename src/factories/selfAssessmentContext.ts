import { Factory } from "fishery"
import { SelfAssessmentContextState } from "../SelfAssessment/Context"

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
