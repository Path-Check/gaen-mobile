import { Posix } from "../utils/dateTime"

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

export type SymptomEntry = {
  id: string
  date: Posix
  symptoms: Symptom[]
}

export type SymptomEntryAttributes = Omit<SymptomEntry, "id">

export const sortSymptomEntries = (entries: SymptomEntry[]): SymptomEntry[] => {
  const compareEntries = (
    entryA: SymptomEntry,
    entryB: SymptomEntry,
  ): number => {
    return Math.sign(entryB.date - entryA.date)
  }

  return entries.sort(compareEntries)
}
