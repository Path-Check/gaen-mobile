import { Posix } from "../utils/dateTime"

export enum HealthAssessment {
  AtRisk,
  NotAtRisk,
}

export type Symptom =
  | "chest_pain_or_pressure"
  | "difficulty_breathing"
  | "lightheadedness"
  | "disorientation_or_unresponsiveness"
  | "fever"
  | "chills"
  | "cough"
  | "loss_of_smell"
  | "loss_of_taste"
  | "loss_of_appetite"
  | "vomiting"
  | "diarrhea"
  | "body_aches"
  | "other"

export type SymptomLogEntry = {
  id: string
  date: Posix
  symptoms: Symptom[]
}

export type SymptomLogEntryAttributes = Omit<SymptomLogEntry, "id">

export type DayLogData = {
  date: Posix
  symptomLogEntries: SymptomLogEntry[]
}

export const determineHealthAssessment = (
  symptoms: Symptom[],
): HealthAssessment => {
  if (symptoms.length > 0) {
    return HealthAssessment.AtRisk
  }
  return HealthAssessment.NotAtRisk
}
