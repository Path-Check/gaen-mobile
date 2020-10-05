import { SymptomLogEntry, dayLogData } from "./symptoms"
import { beginningOfDay } from "../utils/dateTime"

describe("dayLogData", () => {
  it("returns a set of log entries grouped by day with entries sorted", () => {
    const earlierDayDateString = "2020-09-21"
    const earlierDayLogEntryOnePosix = Date.parse(
      `${earlierDayDateString} 10:00`,
    )
    const earlierDayDatePosix = beginningOfDay(earlierDayLogEntryOnePosix)
    const earlierDayLogEntryOne: SymptomLogEntry = {
      id: "1",
      symptoms: ["fever", "cough"],
      date: earlierDayLogEntryOnePosix,
    }
    const earlierDayLogEntryTwoPosix = Date.parse(
      `${earlierDayDateString} 12:00`,
    )
    const earlierDayLogEntryTwo: SymptomLogEntry = {
      id: "2",
      symptoms: ["fever"],
      date: earlierDayLogEntryTwoPosix,
    }
    const middleDayDateString = "2020-09-22"
    const middleDayLogEntryOnePosix = Date.parse(`${middleDayDateString} 10:00`)
    const middleDayDatePosix = beginningOfDay(middleDayLogEntryOnePosix)
    const middleDayLogEntryOne: SymptomLogEntry = {
      id: "3",
      symptoms: ["fever"],
      date: middleDayLogEntryOnePosix,
    }
    const middleDayLogEntryTwoPosix = Date.parse(`${middleDayDateString} 12:00`)
    const middleDayLogEntryTwo: SymptomLogEntry = {
      id: "4",
      symptoms: ["cough"],
      date: middleDayLogEntryTwoPosix,
    }

    const recentDayEntryDateString = "2020-09-23"
    const recentDayLogEntryPosix = Date.parse(
      `${recentDayEntryDateString} 12:00`,
    )
    const recentDayEntryDatePosix = beginningOfDay(recentDayLogEntryPosix)
    const recentDayEntry: SymptomLogEntry = {
      id: "5",
      symptoms: ["cough"],
      date: recentDayLogEntryPosix,
    }
    expect(
      dayLogData([
        middleDayLogEntryTwo,
        recentDayEntry,
        earlierDayLogEntryOne,
        middleDayLogEntryOne,
        earlierDayLogEntryTwo,
      ]),
    ).toEqual([
      {
        date: recentDayEntryDatePosix,
        symptomLogEntries: [recentDayEntry],
      },
      {
        date: middleDayDatePosix,
        symptomLogEntries: [middleDayLogEntryOne, middleDayLogEntryTwo],
      },
      {
        date: earlierDayDatePosix,
        symptomLogEntries: [earlierDayLogEntryOne, earlierDayLogEntryTwo],
      },
    ])
  })

  it("sort and combine daily log entries with daily check ins", () => {
    const logEntryDateString = "2020-09-21"
    const logEntryDatePosix = Date.parse(`${logEntryDateString} 10:00`)
    const logEntryKeyDate = beginningOfDay(logEntryDatePosix)
    const logEntryA: SymptomLogEntry = {
      id: "1",
      symptoms: ["fever", "cough"],
      date: logEntryKeyDate,
    }
    const earlierDateCheckInString = "2020-09-20"
    const earlierDateCheckInPosix = Date.parse(
      `${earlierDateCheckInString} 12:00`,
    )
    const earlierDateCheckInBeginningOfDay = beginningOfDay(
      earlierDateCheckInPosix,
    )
    const logEntryB: SymptomLogEntry = {
      id: "1",
      symptoms: ["fever", "cough"],
      date: earlierDateCheckInBeginningOfDay,
    }
    const laterDateCheckInString = "2020-09-22"
    const laterDateCheckInPosix = Date.parse(`${laterDateCheckInString} 12:00`)
    const laterDateCheckInBeginningOfDay = beginningOfDay(laterDateCheckInPosix)

    const logEntryC: SymptomLogEntry = {
      id: "1",
      symptoms: ["fever", "cough"],
      date: laterDateCheckInBeginningOfDay,
    }

    expect(dayLogData([logEntryA, logEntryB, logEntryC])).toEqual([
      {
        date: laterDateCheckInBeginningOfDay,
        symptomLogEntries: [logEntryC],
      },
      {
        date: logEntryKeyDate,
        symptomLogEntries: [logEntryA],
      },
      {
        date: earlierDateCheckInBeginningOfDay,
        symptomLogEntries: [logEntryB],
      },
    ])
  })
})
