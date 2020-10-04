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

export enum CheckInStatus {
  NotCheckedIn,
  FeelingGood,
  FeelingNotWell,
}

// Raw Daily Checkin
export type CheckIn = {
  date: Posix
  status: CheckInStatus
}

export type SymptomLogEntry = {
  id: string
  date: Posix
  symptoms: Symptom[]
}

export type SymptomLogEntryAttributes = Omit<SymptomLogEntry, "id">

type LogData = {
  checkIn: CheckIn | null
  logEntries: SymptomLogEntry[]
}

type LogDataByDay = Record<Posix, LogData>

export type DayLogData = LogData & {
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
      const newLogEntries = groupedEntries[entryDateBeginningOfDay].logEntries
      newLogEntries.push(entry)
      newLogEntries.sort(compareDatesAscending)
      groupedEntries[entryDateBeginningOfDay].logEntries = newLogEntries
    } else {
      groupedEntries[entryDateBeginningOfDay] = {
        logEntries: [entry],
        checkIn: null,
      }
    }
  })

  return groupedEntries
}

const joinLogDataAndCheckIns = (
  logDataByDay: LogDataByDay,
  checkIns: CheckIn[],
): LogDataByDay => {
  checkIns.forEach((checkIn) => {
    const { date } = checkIn
    const checkInBeginningOfDay = beginningOfDay(date)

    if (logDataByDay[checkInBeginningOfDay]) {
      logDataByDay[checkInBeginningOfDay].checkIn = checkIn
    } else {
      logDataByDay[checkInBeginningOfDay] = {
        logEntries: [],
        checkIn,
      }
    }
  })
  return logDataByDay
}

export const combineSymptomAndCheckInLogs = (
  symptomLogEntries: SymptomLogEntry[],
  checkIns: CheckIn[],
): DayLogData[] => {
  const symptomEntriesLogData = groupLogEntriesByDay(symptomLogEntries)
  const dailyLogData = joinLogDataAndCheckIns(symptomEntriesLogData, checkIns)

  return Object.keys(dailyLogData)
    .map((date: string) => {
      const posixDate = Number(date)
      return {
        date: posixDate,
        ...dailyLogData[posixDate],
      }
    })
    .sort(compareDatesDescending)
}
