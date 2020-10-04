import { Factory } from "fishery"
import { SelfScreenerAnswers } from "src/SelfScreener/selfScreener"

export default Factory.define<SelfScreenerAnswers>(() => {
  return {
    emergencySymptoms: [],
    primarySymptoms: [],
    secondarySymptoms: [],
    otherSymptoms: [],
    underlyingConditions: [],
    ageRange: null,
  }
})
