import dayjs from "dayjs"

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

const toSymptom = (rawSymptom: string): Symptom | null => {
  switch (rawSymptom) {
    case "chest_pain_or_pressure": {
      return "chest_pain_or_pressure"
    }
    case "difficulty_breathing": {
      return "difficulty_breathing"
    }
    case "lightheadedness": {
      return "lightheadedness"
    }
    case "disorientation_or_unresponsiveness": {
      return "disorientation_or_unresponsiveness"
    }
    case "fever": {
      return "fever"
    }
    case "chills": {
      return "chills"
    }
    case "cough": {
      return "cough"
    }
    case "loss_of_smell": {
      return "loss_of_smell"
    }
    case "loss_of_taste": {
      return "loss_of_taste"
    }
    case "loss_of_appetite": {
      return "loss_of_appetite"
    }
    case "vomiting": {
      return "vomiting"
    }
    case "diarrhea": {
      return "diarrhea"
    }
    case "body_aches": {
      return "body_aches"
    }
    default: {
      return null
    }
  }
}

export interface NoData {
  id: string
  kind: "NoData"
  date: Posix
}

export interface NoSymptoms {
  id: string
  kind: "NoSymptoms"
  date: Posix
}

export interface Symptoms {
  id: string
  kind: "Symptoms"
  date: Posix
  symptoms: Symptom[]
}

export type SymptomEntry = NoData | NoSymptoms | Symptoms

export type SymptomHistory = SymptomEntry[]

export type SymptomHistoryByDay = Record<Posix, SymptomEntry>

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

type RawEntry = {
  id: string
  date: number
  symptoms: string[]
}

export const toSymptomHistory = (rawEntries: RawEntry[]): SymptomHistory => {
  const blankHistory: SymptomHistory = calendarDays(14)

  rawEntries.reduce<SymptomHistory>(
    (acc: SymptomHistory, rawEntry: RawEntry) => {
      // what day the raw entry belongs to
      // make a new history with the entry added to that date.
      //
      return addEntry(toEntry(rawEntry), acc)
    },
    blankHistory,
  )
}

const toEntry = (rawEntry: RawEntry): SymptomEntry => {
  const { id, date, symptoms: rawSymptoms } = rawEntry
  if (rawSymptoms.length > 0) {
    const symptoms: Symptom[] = rawSymptoms.reduce<Symptom[]>(
      (acc: Symptom[], rawSymptom: string) => {
        const symptom = toSymptom(rawSymptom)
        if (symptom) {
          return [symptom, ...acc]
        } else {
          return acc
        }
      },
      [],
    )

    return {
      kind: "Symptoms",
      id,
      date,
      symptoms,
    }
  } else {
    return {
      kind: "NoSymptoms",
      id,
      date,
    }
  }
}

const addEntry = (
  entry: SymptomEntry,
  history: SymptomHistory,
): SymptomHistory => {
  return history
}

export const calendarDays = (totalDays: number): Posix[] => {
  const now = Date.now()

  const daysAgo = [...Array(totalDays)].map((_v, idx: number) => {
    return totalDays - 1 - idx
  })

  return daysAgo.map(
    (daysAgo: number): Posix => {
      return dayjs(now).subtract(daysAgo, "day").startOf("day").valueOf()
    },
  )
}
