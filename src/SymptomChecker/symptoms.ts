export enum HealthAssessment {
  AtRisk,
  NotAtRisk,
}

export type Symptom = string

export const determineHealthAssessment = (
  symptoms: Symptom[],
): HealthAssessment => {
  if (symptoms.length > 0) {
    return HealthAssessment.AtRisk
  } else {
    return HealthAssessment.NotAtRisk
  }
}
