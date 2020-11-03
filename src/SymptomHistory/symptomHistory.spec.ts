import { daysAgoFrom } from "../utils/dateTime"

import { Symptom, emergencySymptoms, all } from "./symptom"
import {
  SymptomHistory,
  RawEntry,
  toSymptomHistory,
  SymptomEntry,
  hasEmergencySymptoms,
} from "./symptomHistory"

describe("toSymptomHistory", () => {
  describe("when given an empty list", () => {
    it("returns a symptom history of the last 14 days each with a no data entry", () => {
      const today = Date.parse("2020-1-15")
      const rawEntries: RawEntry[] = []

      const result = toSymptomHistory(today, rawEntries)

      const expected: SymptomHistory = [
        { kind: "NoUserInput", date: today },
        { kind: "NoUserInput", date: daysAgoFrom(1, today) },
        { kind: "NoUserInput", date: daysAgoFrom(2, today) },
        { kind: "NoUserInput", date: daysAgoFrom(3, today) },
        { kind: "NoUserInput", date: daysAgoFrom(4, today) },
        { kind: "NoUserInput", date: daysAgoFrom(5, today) },
        { kind: "NoUserInput", date: daysAgoFrom(6, today) },
        { kind: "NoUserInput", date: daysAgoFrom(7, today) },
        { kind: "NoUserInput", date: daysAgoFrom(8, today) },
        { kind: "NoUserInput", date: daysAgoFrom(9, today) },
        { kind: "NoUserInput", date: daysAgoFrom(10, today) },
        { kind: "NoUserInput", date: daysAgoFrom(11, today) },
        { kind: "NoUserInput", date: daysAgoFrom(12, today) },
        { kind: "NoUserInput", date: daysAgoFrom(13, today) },
      ]
      expect(result).toEqual(expected)
    })
  })

  describe("when given a list of raw entries", () => {
    it("returns a symptom history with the correct days having the correct symptoms", () => {
      const today = Date.parse("2020-1-15")
      const rawEntries: RawEntry[] = [
        { id: "a", date: today, symptoms: ["cough"] },
        { id: "b", date: daysAgoFrom(3, today), symptoms: [] },
      ]

      const result = toSymptomHistory(today, rawEntries)

      const expected: SymptomHistory = [
        {
          kind: "UserInput",
          id: "a",
          date: today,
          symptoms: new Set<Symptom>(["cough"]),
        },
        { kind: "NoUserInput", date: daysAgoFrom(1, today) },
        { kind: "NoUserInput", date: daysAgoFrom(2, today) },
        {
          kind: "UserInput",
          id: "b",
          date: daysAgoFrom(3, today),
          symptoms: new Set<Symptom>(),
        },
        { kind: "NoUserInput", date: daysAgoFrom(4, today) },
        { kind: "NoUserInput", date: daysAgoFrom(5, today) },
        { kind: "NoUserInput", date: daysAgoFrom(6, today) },
        { kind: "NoUserInput", date: daysAgoFrom(7, today) },
        { kind: "NoUserInput", date: daysAgoFrom(8, today) },
        { kind: "NoUserInput", date: daysAgoFrom(9, today) },
        { kind: "NoUserInput", date: daysAgoFrom(10, today) },
        { kind: "NoUserInput", date: daysAgoFrom(11, today) },
        { kind: "NoUserInput", date: daysAgoFrom(12, today) },
        { kind: "NoUserInput", date: daysAgoFrom(13, today) },
      ]
      expect(result).toEqual(expected)
    })
  })

  describe("when given two entries from the same date", () => {
    it("combines the entries", () => {
      const today = Date.parse("2020-1-1")
      const rawEntries: RawEntry[] = [
        { id: "a", date: today, symptoms: ["cough"] },
        { id: "b", date: today, symptoms: ["fever_or_chills", "other"] },
      ]

      const result = toSymptomHistory(today, rawEntries)

      const expected: SymptomEntry = {
        kind: "UserInput",
        id: "b",
        date: today,
        symptoms: new Set<Symptom>(["cough", "fever_or_chills", "other"]),
      }

      expect(entryIsEqual(result[0], expected)).toBeTruthy()
    })
  })

  describe("hasEmergencySymptoms", () => {
    describe("when the set of logged symptoms has emergency symptoms", () => {
      it("returns true", () => {
        emergencySymptoms.forEach((emergencySymptom) => {
          const loggedSymptomsWithEmergency = new Set<Symptom>([
            emergencySymptom,
          ])

          expect(hasEmergencySymptoms(loggedSymptomsWithEmergency)).toBeTruthy()
        })
      })
    })

    describe("when the set of logged symptoms has no emergency symptoms", () => {
      it("returns false", () => {
        const nonEmergencySymptoms = all.filter((symptom) => {
          return !emergencySymptoms.includes(symptom)
        })
        nonEmergencySymptoms.forEach((emergencySymptom) => {
          const loggedSymptomsWithEmergency = new Set<Symptom>([
            emergencySymptom,
          ])

          expect(hasEmergencySymptoms(loggedSymptomsWithEmergency)).toBeFalsy()
        })
      })
    })
  })
})

const entryIsEqual = (entryA: SymptomEntry, entryB: SymptomEntry): boolean => {
  if (entryA.kind !== entryB.kind || entryA.date !== entryB.date) {
    return false
  } else if (entryA.kind === "UserInput" && entryB.kind === "UserInput") {
    return (
      entryA.id === entryB.id && setIsEqual(entryA.symptoms, entryB.symptoms)
    )
  } else {
    return true
  }
}

const setIsEqual = <T>(setA: Set<T>, setB: Set<T>): boolean => {
  const inter = intersection(setA, setB)
  return setA.size === setB.size && inter.size === setA.size
}

function intersection<T>(setA: Set<T>, setB: Set<T>): Set<T> {
  const intersection = new Set<T>()
  for (const elem of setB) {
    if (setA.has(elem)) {
      intersection.add(elem)
    }
  }
  return intersection
}
