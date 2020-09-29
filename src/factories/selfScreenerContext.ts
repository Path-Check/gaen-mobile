import { Factory } from "fishery"
import { SelfScreenerContextState } from "../SelfScreenerContext"

export default Factory.define<SelfScreenerContextState>(() => ({
  emergencySymptoms: [],
  updateEmergencySymptoms: () => {},
  generalSymptoms: [],
  updateGeneralSymptoms: () => {},
  underlyingConditions: [],
  updateUnderlyingConditions: () => {},
  ageRange: null,
  updateAgeRange: () => {},
}))
