export enum HealthAssessment {
  AtRisk,
  NotAtRisk,
}

export type Symptom = string

export const determineHealthAssessment = (
  _symptoms: Symptom[],
): HealthAssessment => {
  return HealthAssessment.AtRisk
}
