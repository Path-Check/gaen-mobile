import React from "react"
import { render } from "@testing-library/react-native"

import { SymptomLogContext } from "./SymptomLogContext"
import { CheckInStatus } from "./symptoms"

import OverTime from "./OverTime"
import { factories } from "../factories"
import { posixToDayjs } from "../utils/dateTime"

jest.mock("@react-navigation/native")

describe("OverTime", () => {
  describe("when the user has log entries with only a checkIn", () => {
    it("shows the correct message, and a date", () => {
      const dateString = "2020-09-21"
      const timeString = "10:00"
      const logEntryPosix = Date.parse(`${dateString} ${timeString}`)
      const { getByText, queryByText } = render(
        <SymptomLogContext.Provider
          value={factories.symptomLogContext.build({
            dailyLogData: [
              {
                date: logEntryPosix,
                checkIn: {
                  status: CheckInStatus.FeelingGood,
                  date: logEntryPosix,
                },
                logEntries: [],
              },
            ],
          })}
        >
          <OverTime />
        </SymptomLogContext.Provider>,
      )

      expect(getByText("You were feeling well")).toBeDefined()
      expect(getByText(dateString)).toBeDefined()
      expect(queryByText(timeString)).toBeNull()
    })
  })

  describe("when the user has log data with no checkIn entries", () => {
    it("shows the correct message, date and symptoms", () => {
      const dateString = "2020-09-21"
      const firstLogEntryPosix = Date.parse(`2020-09-21 10:00`)
      const firstTimeString =
        posixToDayjs(firstLogEntryPosix)?.local()?.format("HH:mm") ||
        "not a date"
      const secondLogEntryPosix = Date.parse(`${dateString} 12:00`)
      const secondTimeString =
        posixToDayjs(secondLogEntryPosix)?.local()?.format("HH:mm") ||
        "not a date"
      const coughSymptom = "cough"
      const lossOfSmellSymptom = "loss_of_smell"
      const { getByText, queryByText } = render(
        <SymptomLogContext.Provider
          value={factories.symptomLogContext.build({
            dailyLogData: [
              {
                date: firstLogEntryPosix,
                checkIn: null,
                logEntries: [
                  {
                    id: "1",
                    symptoms: [coughSymptom],
                    date: firstLogEntryPosix,
                  },
                  {
                    id: "2",
                    symptoms: [lossOfSmellSymptom],
                    date: secondLogEntryPosix,
                  },
                ],
              },
            ],
          })}
        >
          <OverTime />
        </SymptomLogContext.Provider>,
      )

      expect(queryByText("You were not feeling well")).toBeNull()
      expect(getByText(dateString)).toBeDefined()
      expect(getByText(firstTimeString)).toBeDefined()
      expect(getByText(secondTimeString)).toBeDefined()
      expect(getByText(coughSymptom)).toBeDefined()
      expect(getByText(lossOfSmellSymptom)).toBeDefined()
    })
  })
})
