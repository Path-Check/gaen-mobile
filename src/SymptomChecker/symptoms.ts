export enum HealthAssessment {
  AtRisk,
  NotAtRisk,
}

export type Symptom = string

export const determineHealthAssessment = (
  symptoms: Symptom[],
): HealthAssessment => {
  if (symptoms.length > 3) {
    return HealthAssessment.AtRisk
  }
  return HealthAssessment.NotAtRisk
}
