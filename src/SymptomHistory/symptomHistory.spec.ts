import { beginningOfDay, daysAgoFrom } from "../utils/dateTime"

import { Symptom } from "./symptom"
import {
  SymptomHistory,
  RawEntry,
  toSymptomHistory,
  SymptomEntry,
  sortByDate,
} from "./symptomHistory"

// when given a empty it returns 14 days of NoData
// when given a list of raw entries it returns a symptom history with the correct entries

describe("toSymptomHistory", () => {
  describe("when given an empty list", () => {
    it("returns a symptom history of the last 14 days each with a no data entry", () => {
      const today = Date.parse("2020-1-15")
      const rawEntries: RawEntry[] = []

      const result = toSymptomHistory(today, rawEntries)

      const expected: SymptomHistory = [
        { kind: "NoData", date: today },
        { kind: "NoData", date: daysAgoFrom(1, today) },
        { kind: "NoData", date: daysAgoFrom(2, today) },
        { kind: "NoData", date: daysAgoFrom(3, today) },
        { kind: "NoData", date: daysAgoFrom(4, today) },
        { kind: "NoData", date: daysAgoFrom(5, today) },
        { kind: "NoData", date: daysAgoFrom(6, today) },
        { kind: "NoData", date: daysAgoFrom(7, today) },
        { kind: "NoData", date: daysAgoFrom(8, today) },
        { kind: "NoData", date: daysAgoFrom(9, today) },
        { kind: "NoData", date: daysAgoFrom(10, today) },
        { kind: "NoData", date: daysAgoFrom(11, today) },
        { kind: "NoData", date: daysAgoFrom(12, today) },
        { kind: "NoData", date: daysAgoFrom(13, today) },
      ]
      expect(result).toEqual(expected)
    })
  })

  describe("when given a list of raw entries", () => {
    it("returns a symptom history with the correct days having the correct symptoms", () => {
      const today = Date.parse("2020-1-15")
      const rawEntries: RawEntry[] = [
        { id: "a", date: today, symptoms: ["cough"] },
      ]

      const result = toSymptomHistory(today, rawEntries)

      const expected: SymptomHistory = [
        {
          kind: "Symptoms",
          id: "a",
          date: today,
          symptoms: new Set<Symptom>(["cough"]),
        },
        { kind: "NoData", date: daysAgoFrom(1, today) },
        { kind: "NoData", date: daysAgoFrom(2, today) },
        { kind: "NoData", date: daysAgoFrom(3, today) },
        { kind: "NoData", date: daysAgoFrom(4, today) },
        { kind: "NoData", date: daysAgoFrom(5, today) },
        { kind: "NoData", date: daysAgoFrom(6, today) },
        { kind: "NoData", date: daysAgoFrom(7, today) },
        { kind: "NoData", date: daysAgoFrom(8, today) },
        { kind: "NoData", date: daysAgoFrom(9, today) },
        { kind: "NoData", date: daysAgoFrom(10, today) },
        { kind: "NoData", date: daysAgoFrom(11, today) },
        { kind: "NoData", date: daysAgoFrom(12, today) },
        { kind: "NoData", date: daysAgoFrom(13, today) },
      ]
      expect(result).toEqual(expected)
    })
  })
})

describe("sortByDate", () => {
  it("returns a list log entries sorted by time descending", () => {
    const log1DateTime = Date.parse("10-1-2020 10:00")
    const log2DateTime = Date.parse("10-2-2020 10:00")
    const log3DateTime = Date.parse("10-2-2020 10:05")
    const log4DateTime = Date.parse("10-2-2020 10:10")
    const log5DateTime = Date.parse("10-3-2020 10:00")

    const log1: SymptomEntry = {
      id: "1",
      kind: "Symptoms",
      symptoms: new Set(["fever", "cough"]),
      date: log1DateTime,
    }
    const log2: SymptomEntry = {
      id: "2",
      kind: "Symptoms",
      symptoms: new Set(["fever", "cough"]),
      date: log2DateTime,
    }
    const log3: SymptomEntry = {
      id: "3",
      kind: "Symptoms",
      symptoms: new Set(["fever", "cough"]),
      date: log3DateTime,
    }
    const log4: SymptomEntry = {
      id: "4",
      kind: "Symptoms",
      symptoms: new Set(["fever", "cough"]),
      date: log4DateTime,
    }
    const log5: SymptomEntry = {
      id: "5",
      kind: "Symptoms",
      symptoms: new Set(["fever", "cough"]),
      date: log5DateTime,
    }
    const unsortedEntries = [log3, log1, log4, log2, log5]

    const result = sortByDate(unsortedEntries)

    const expected = [log5, log4, log3, log2, log1]
    expect(result).toEqual(expected)
  })
})
