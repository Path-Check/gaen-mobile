import { SymptomLogEntry, sortSymptomEntries } from "./symptoms"

describe("sortSymptomEntries", () => {
  it("returns a list log entries sorted by time descending", () => {
    const log1DateTime = Date.parse("10-1-2020 10:00")
    const log2DateTime = Date.parse("10-2-2020 10:00")
    const log3DateTime = Date.parse("10-2-2020 10:05")
    const log4DateTime = Date.parse("10-2-2020 10:10")
    const log5DateTime = Date.parse("10-3-2020 10:00")

    const log1: SymptomLogEntry = {
      id: "1",
      symptoms: ["fever", "cough"],
      date: log1DateTime,
    }
    const log2: SymptomLogEntry = {
      id: "2",
      symptoms: ["fever", "cough"],
      date: log2DateTime,
    }
    const log3: SymptomLogEntry = {
      id: "3",
      symptoms: ["fever", "cough"],
      date: log3DateTime,
    }
    const log4: SymptomLogEntry = {
      id: "4",
      symptoms: ["fever", "cough"],
      date: log4DateTime,
    }
    const log5: SymptomLogEntry = {
      id: "5",
      symptoms: ["fever", "cough"],
      date: log5DateTime,
    }
    const unsortedEntries = [log3, log1, log4, log2, log5]

    const result = sortSymptomEntries(unsortedEntries)

    const expected = [log5, log4, log3, log2, log1]
    expect(result).toEqual(expected)
  })
})
