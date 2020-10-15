import { SymptomEntry, sortSymptomEntries } from "./symptomHistory"

describe("sortSymptomEntries", () => {
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

    const result = sortSymptomEntries(unsortedEntries)

    const expected = [log5, log4, log3, log2, log1]
    expect(result).toEqual(expected)
  })
})
