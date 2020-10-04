import {
  SymptomLogEntry,
  combineSymptomAndCheckInLogs,
  CheckInStatus,
} from "./symptoms"
import { beginningOfDay } from "../utils/dateTime"

describe("combineSymptomAndCheckInLogs", () => {
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
      combineSymptomAndCheckInLogs(
        [
          middleDayLogEntryTwo,
          recentDayEntry,
          earlierDayLogEntryOne,
          middleDayLogEntryOne,
          earlierDayLogEntryTwo,
        ],
        [],
      ),
    ).toEqual([
      {
        date: recentDayEntryDatePosix,
        logEntries: [recentDayEntry],
        checkIn: null,
      },
      {
        date: middleDayDatePosix,
        logEntries: [middleDayLogEntryOne, middleDayLogEntryTwo],
        checkIn: null,
      },
      {
        date: earlierDayDatePosix,
        logEntries: [earlierDayLogEntryOne, earlierDayLogEntryTwo],
        checkIn: null,
      },
    ])
  })

  it("sort and combine daily log entries with daily check ins", () => {
    const logEntryDateString = "2020-09-21"
    const logEntryDatePosix = Date.parse(`${logEntryDateString} 10:00`)
    const logEntryKeyDate = beginningOfDay(logEntryDatePosix)
    const logEntry: SymptomLogEntry = {
      id: "1",
      symptoms: ["fever", "cough"],
      date: logEntryDatePosix,
    }
    const symptomLogEntries: SymptomLogEntry[] = [logEntry]
    const sameDateCheckInPosix = Date.parse(`${logEntryDateString} 12:00`)
    const sameDateCheckIn = {
      date: sameDateCheckInPosix,
      status: CheckInStatus.FeelingGood,
    }
    const earlierDateCheckInString = "2020-09-20"
    const earlierDateCheckInPosix = Date.parse(
      `${earlierDateCheckInString} 12:00`,
    )
    const earlierDateCheckInBeginningOfDay = beginningOfDay(
      earlierDateCheckInPosix,
    )
    const earlierDateCheckIn = {
      date: earlierDateCheckInPosix,
      status: CheckInStatus.NotCheckedIn,
    }
    const laterDateCheckInString = "2020-09-22"
    const laterDateCheckInPosix = Date.parse(`${laterDateCheckInString} 12:00`)
    const laterDateCheckInBeginningOfDay = beginningOfDay(laterDateCheckInPosix)
    const laterDateCheckIn = {
      date: laterDateCheckInPosix,
      status: CheckInStatus.FeelingNotWell,
    }

    expect(
      combineSymptomAndCheckInLogs(symptomLogEntries, [
        sameDateCheckIn,
        laterDateCheckIn,
        earlierDateCheckIn,
      ]),
    ).toEqual([
      {
        date: laterDateCheckInBeginningOfDay,
        checkIn: laterDateCheckIn,
        logEntries: [],
      },
      {
        date: logEntryKeyDate,
        checkIn: sameDateCheckIn,
        logEntries: [logEntry],
      },
      {
        date: earlierDateCheckInBeginningOfDay,
        checkIn: earlierDateCheckIn,
        logEntries: [],
      },
    ])
  })
})
