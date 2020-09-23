import { serializeDailyLogData, CheckInStatus } from "./symptoms"
import { beginningOfDay } from "../utils/dateTime"

describe("serializeDailyLogData", () => {
  it("returns a set of log entries grouped by day with entries sorted", () => {
    const earlierDayDateString = "2020-09-21"
    const earlierDayLogEntryOnePosix = Date.parse(
      `${earlierDayDateString} 10:00`,
    )
    const earlierDayDatePosix = beginningOfDay(earlierDayLogEntryOnePosix)
    const earlierDayLogEntryOne = {
      id: "1",
      symptoms: ["symptom1", "symptom2"],
      date: earlierDayLogEntryOnePosix,
    }
    const earlierDayLogEntryTwoPosix = Date.parse(
      `${earlierDayDateString} 12:00`,
    )
    const earlierDayLogEntryTwo = {
      id: "2",
      symptoms: ["symptom1"],
      date: earlierDayLogEntryTwoPosix,
    }
    const middleDayDateString = "2020-09-22"
    const middleDayLogEntryOnePosix = Date.parse(`${middleDayDateString} 10:00`)
    const middleDayDatePosix = beginningOfDay(middleDayLogEntryOnePosix)
    const middleDayLogEntryOne = {
      id: "3",
      symptoms: ["symptom1"],
      date: middleDayLogEntryOnePosix,
    }
    const middleDayLogEntryTwoPosix = Date.parse(`${middleDayDateString} 12:00`)
    const middleDayLogEntryTwo = {
      id: "4",
      symptoms: ["symptom2"],
      date: middleDayLogEntryTwoPosix,
    }

    const recentDayEntryDateString = "2020-09-23"
    const recentDayLogEntryPosix = Date.parse(
      `${recentDayEntryDateString} 12:00`,
    )
    const recentDayEntryDatePosix = beginningOfDay(recentDayLogEntryPosix)
    const recentDayEntry = {
      id: "5",
      symptoms: ["symptom2"],
      date: recentDayLogEntryPosix,
    }
    expect(
      serializeDailyLogData(
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
    const logEntry = {
      id: "1",
      symptoms: ["symptom1", "symptom2"],
      date: logEntryDatePosix,
    }
    const symptomLogEntries = [logEntry]
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
      serializeDailyLogData(symptomLogEntries, [
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
