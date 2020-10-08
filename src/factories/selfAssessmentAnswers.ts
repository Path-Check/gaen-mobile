import { Factory } from "fishery"
import { SelfAssessmentAnswers } from "src/SelfAssessment/selfAssessment"

export default Factory.define<SelfAssessmentAnswers>(() => {
  return {
    emergencySymptoms: [],
    primarySymptoms: [],
    secondarySymptoms: [],
    otherSymptoms: [],
    underlyingConditions: [],
    ageRange: null,
  }
})
