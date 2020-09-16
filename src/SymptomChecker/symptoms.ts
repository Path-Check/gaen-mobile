export enum HealthRecommendation {
  GetTested,
  FollowHAGuidance,
}

export type Symptom = string

export const determineHealthRecommendation = (
  symptoms: Symptom[],
): HealthRecommendation => {
  if (symptoms.length > 3) {
    return HealthRecommendation.GetTested
  }
  return HealthRecommendation.FollowHAGuidance
}
