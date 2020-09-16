export enum HealthAssessment {
  GetTested,
  FollowHAGuidance,
}

export type Symptom = string

export const determineHealthAssessment = (
  symptoms: Symptom[],
): HealthAssessment => {
  if (symptoms.length > 3) {
    return HealthAssessment.GetTested
  }
  return HealthAssessment.FollowHAGuidance
}
