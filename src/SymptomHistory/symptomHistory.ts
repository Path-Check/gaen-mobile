import dayjs from "dayjs"
import { Posix, isSameDay } from "../utils/dateTime"

import * as Symptom from "./symptom"

export type SymptomEntry = NoUserInput | UserInput

export interface NoUserInput {
  kind: "NoUserInput"
  date: Posix
}

export interface UserInput {
  id: string
  kind: "UserInput"
  date: Posix
  symptoms: Set<Symptom.Symptom>
}

export type SymptomHistory = SymptomEntry[]

export interface SymptomEntryAttributes {
  date: Posix
  symptoms: Set<Symptom.Symptom>
}

export type RawEntry = {
  id: string
  date: number
  symptoms: string[]
}

export const toSymptomHistory = (
  today: Posix,
  rawEntries: RawEntry[],
): SymptomHistory => {
  const initialHistory: SymptomHistory = blankHistory(today, 14)

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

  const toSymptomSet = (rawSymptoms: string[]): Set<Symptom.Symptom> => {
    return rawSymptoms.reduce<Set<Symptom.Symptom>>(
      (acc: Set<Symptom.Symptom>, rawSymptom: string) => {
        const symptom = Symptom.fromString(rawSymptom)
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
    kind: "UserInput",
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
  const entries = `${entryA.kind} ${entryB.kind}`
  switch (entries) {
    case "NoUserInput NoUserInput": {
      return entryA
    }
    case "NoUserInput UserInput": {
      return entryB
    }
    case "UserInput NoUserInput": {
      return entryA
    }
    case "UserInput UserInput": {
      const a = entryA as UserInput
      const b = entryB as UserInput
      return {
        id: a.id,
        kind: "UserInput",
        date: a.date,
        symptoms: union(a.symptoms, b.symptoms),
      }
    }
    default: {
      return entryA
    }
  }
}

const blankHistory = (today: Posix, totalDays: number): SymptomHistory => {
  const range = (length: number) => {
    return [...Array(length)].map((_v, idx: number) => idx)
  }

  const daysAgo = range(totalDays)

  return daysAgo.map(
    (daysAgo: number): SymptomEntry => {
      return {
        kind: "NoUserInput",
        date: dayjs(today).subtract(daysAgo, "day").startOf("day").valueOf(),
      }
    },
  )
}

export const hasEmergencySymptoms = (
  loggedSymptoms: Set<Symptom.Symptom>,
): boolean => {
  return Boolean(
    Symptom.emergencySymptoms.find((emergencySymptom) => {
      return loggedSymptoms.has(emergencySymptom)
    }),
  )
}

export const hasCovidSymptoms = (
  loggedSymptoms: Set<Symptom.Symptom>,
): boolean => {
  return Boolean(
    Symptom.covidSymptoms.find((symptom) => {
      return loggedSymptoms.has(symptom)
    }),
  )
}
