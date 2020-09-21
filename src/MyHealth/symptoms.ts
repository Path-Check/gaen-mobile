import { Posix, beginningOfDay } from "../utils/dateTime"

export enum HealthAssessment {
  AtRisk,
  NotAtRisk,
}

export type Symptom = string

export enum CheckInStatus {
  NotCheckedIn,
  FeelingGood,
  FeelingNotWell,
}

// Raw Daily Checkin
export type DailyCheckIn = {
  date: Posix
  status: CheckInStatus
}

// Raw Log Entry
export type SymptomLogEntry = {
  id: string
  date: Posix
  symptoms: Symptom[]
}

type LogData = {
  checkIn: DailyCheckIn | null
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

const groupLogEntriesDaily = (allEntries: SymptomLogEntry[]): LogDataByDay => {
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

const joinLogDataAndDailyCheckIns = (
  logData: LogDataByDay,
  dailyCheckIns: DailyCheckIn[],
): LogDataByDay => {
  dailyCheckIns.forEach((checkIn) => {
    const { date } = checkIn
    const checkInBeginningOfDay = beginningOfDay(date)

    if (logData[checkInBeginningOfDay]) {
      logData[checkInBeginningOfDay].checkIn = checkIn
    } else {
      logData[checkInBeginningOfDay] = {
        logEntries: [],
        checkIn,
      }
    }
  })
  return logData
}

export const serializeDailyLogData = (
  symptomLogEntries: SymptomLogEntry[],
  dailyCheckIns: DailyCheckIn[],
): DayLogData[] => {
  const symptomEntriesLogData = groupLogEntriesDaily(symptomLogEntries)
  const dailyLogData = joinLogDataAndDailyCheckIns(
    symptomEntriesLogData,
    dailyCheckIns,
  )

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
