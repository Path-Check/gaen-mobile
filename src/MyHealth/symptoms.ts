import { Posix, beginningOfDay } from "../utils/dateTime"

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

type LogDataByDay = Record<Posix, SymptomLogEntry[]>

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

type WithADate = { date: Posix }
const compareDatesAscending = (
  { date: dateLeft }: WithADate,
  { date: dateRight }: WithADate,
) => {
  return dateLeft < dateRight ? -1 : 1
}
const compareDatesDescending = (
  { date: dateLeft }: WithADate,
  { date: dateRight }: WithADate,
) => {
  return dateLeft < dateRight ? 1 : -1
}

const groupLogEntriesByDay = (allEntries: SymptomLogEntry[]): LogDataByDay => {
  const groupedEntries: LogDataByDay = {}

  allEntries.forEach((entry) => {
    const { date } = entry
    const entryDateBeginningOfDay = beginningOfDay(date)

    if (groupedEntries[entryDateBeginningOfDay]) {
      const newLogEntries = groupedEntries[entryDateBeginningOfDay]
      newLogEntries.push(entry)
      newLogEntries.sort(compareDatesAscending)
      groupedEntries[entryDateBeginningOfDay] = newLogEntries
    } else {
      groupedEntries[entryDateBeginningOfDay] = [entry]
    }
  })

  return groupedEntries
}

export const combineSymptomAndCheckInLogs = (
  symptomLogEntries: SymptomLogEntry[],
): DayLogData[] => {
  const symptomEntriesLogData = groupLogEntriesByDay(symptomLogEntries)

  return Object.keys(symptomEntriesLogData)
    .map((date: string) => {
      const posixDate = Number(date)
      return {
        date: posixDate,
        symptomLogEntries: symptomEntriesLogData[posixDate],
      }
    })
    .sort(compareDatesDescending)
}
