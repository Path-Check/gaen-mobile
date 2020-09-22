import { Posix } from "../utils/dateTime"

export enum HealthAssessment {
  AtRisk,
  NotAtRisk,
}

export type Symptom = string

export type SymptomLogEntry = {
  id: number
  symptoms: Symptom[]
  healthAssessment: HealthAssessment
  date: Posix
}

export const determineHealthAssessment = (
  symptoms: Symptom[],
): HealthAssessment => {
  if (symptoms.length > 0) {
    return HealthAssessment.AtRisk
  }
  return HealthAssessment.NotAtRisk
}
