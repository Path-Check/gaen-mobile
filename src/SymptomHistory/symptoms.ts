import dayjs from "dayjs"

import { Posix, isSameDay } from "../utils/dateTime"

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
  kind: "NoData"
  date: Posix
}

export interface Symptoms {
  id: string
  kind: "Symptoms"
  date: Posix
  symptoms: Set<Symptom>
}

export type SymptomEntry = NoData | Symptoms

export type SymptomHistory = SymptomEntry[]

export type SymptomHistoryByDay = Record<Posix, SymptomEntry>

export interface SymptomEntryAttributes {
  date: Posix
  symptoms: Set<Symptom>
}

export const sortSymptomEntries = (entries: SymptomEntry[]): SymptomEntry[] => {
  const compareEntries = (
    entryA: SymptomEntry,
    entryB: SymptomEntry,
  ): number => {
    return Math.sign(entryB.date - entryA.date)
  }

  return entries.sort(compareEntries)
}

export type RawEntry = {
  id: string
  date: number
  symptoms: string[]
}

export const toSymptomHistory = (rawEntries: RawEntry[]): SymptomHistory => {
  const initialHistory: SymptomHistory = blankHistory(14)

  return rawEntries.reduce<SymptomHistory>(
    (acc: SymptomHistory, rawEntry: RawEntry) => {
      const entry = toEntry(rawEntry)

      return addEntry(entry, acc)
    },
    initialHistory,
  )
}

const toEntry = (rawEntry: RawEntry): SymptomEntry => {
  const { id, date, symptoms: rawSymptoms } = rawEntry

  const toSymptomSet = (rawSymptoms: string[]): Set<Symptom> => {
    return rawSymptoms.reduce<Set<Symptom>>(
      (acc: Set<Symptom>, rawSymptom: string) => {
        const symptom = toSymptom(rawSymptom)
        if (symptom) {
          return acc.add(symptom)
        } else {
          return acc
        }
      },
      new Set(),
    )
  }

  return {
    kind: "Symptoms",
    id,
    date,
    symptoms: toSymptomSet(rawSymptoms),
  }
}

const addEntry = (
  entry: SymptomEntry,
  history: SymptomHistory,
): SymptomHistory => {
  return history.map(
    (el: SymptomEntry): SymptomEntry => {
      if (isSameDay(entry.date, el.date)) {
        return combineEntries(entry, el)
      } else {
        return el
      }
    },
  )
}

const union = <T>(setA: Set<T>, setB: Set<T>): Set<T> => {
  const union = new Set(setA)
  for (const elem of setB) {
    union.add(elem)
  }
  return union
}

const combineEntries = (
  entryA: SymptomEntry,
  entryB: SymptomEntry,
): SymptomEntry => {
  switch ([entryA.kind, entryB.kind]) {
    case ["NoData", "NoData"]: {
      return entryA
    }
    case ["NoData", "Symptoms"]: {
      return entryB
    }
    case ["Symptoms", "NoData"]: {
      return entryA
    }
    case ["Symptoms", "Symptoms"]: {
      const a = entryA as Symptoms
      const b = entryB as Symptoms
      return {
        id: a.id,
        kind: "Symptoms",
        date: a.date,
        symptoms: union(a.symptoms, b.symptoms),
      }
    }
    default: {
      return entryA
    }
  }
}

const blankHistory = (totalDays: number): SymptomHistory => {
  const now = Date.now()

  const daysAgo = [...Array(totalDays)].map((_v, idx: number) => {
    return totalDays - 1 - idx
  })

  return daysAgo.map(
    (daysAgo: number): SymptomEntry => {
      return {
        kind: "NoData",
        date: dayjs(now).subtract(daysAgo, "day").startOf("day").valueOf(),
      }
    },
  )
}
