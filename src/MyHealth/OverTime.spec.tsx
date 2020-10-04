import React from "react"
import { fireEvent, render } from "@testing-library/react-native"
import { useNavigation } from "@react-navigation/native"

import { SymptomLogContext } from "./SymptomLogContext"
import { SymptomLogEntry, CheckInStatus } from "./symptoms"

import OverTime from "./OverTime"
import { factories } from "../factories"
import { posixToDayjs } from "../utils/dateTime"
import { MyHealthStackScreens } from "../navigation"

jest.mock("@react-navigation/native")

describe("OverTime", () => {
  describe("when the user has no checkins or symptom logs", () => {
    it("displays a 'no logs' message", () => {
      const { getByText } = render(
        <SymptomLogContext.Provider
          value={factories.symptomLogContext.build({
            dailyLogData: [],
          })}
        >
          <OverTime />
        </SymptomLogContext.Provider>,
      )

      expect(getByText("No symptom history")).toBeDefined()
    })
  })

  describe("when the user has log entries with only a checkIn", () => {
    it("shows the correct message, and a date", () => {
      const dateString = "September 21, 2020"
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
      const dateString = "September 21, 2020"
      const firstLogEntryPosix = Date.parse(`2020-09-21 10:00`)
      const firstTimeString =
        posixToDayjs(firstLogEntryPosix)?.local()?.format("HH:mm A") ||
        "not a date"
      const secondLogEntryPosix = Date.parse(`${dateString} 12:00`)
      const secondTimeString =
        posixToDayjs(secondLogEntryPosix)?.local()?.format("HH:mm A") ||
        "not a date"
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
                    symptoms: ["cough"],
                    date: firstLogEntryPosix,
                  },
                  {
                    id: "2",
                    symptoms: ["loss_of_smell"],
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
      expect(getByText("Cough")).toBeDefined()
      expect(getByText("Loss of smell")).toBeDefined()
    })
  })

  describe("when the user has symptom logs", () => {
    it("allows the user to edit a symptom log", () => {
      const navigateSpy = jest.fn()
      ;(useNavigation as jest.Mock).mockReturnValue({
        navigate: navigateSpy,
      })

      const logEntryPosix = Date.parse(`2020-09-21 10:00`)
      const logEntry: SymptomLogEntry = {
        id: "1",
        symptoms: ["cough"],
        date: logEntryPosix,
      }
      const { getByLabelText } = render(
        <SymptomLogContext.Provider
          value={factories.symptomLogContext.build({
            dailyLogData: [
              {
                date: logEntryPosix,
                checkIn: {
                  status: CheckInStatus.FeelingGood,
                  date: logEntryPosix,
                },
                logEntries: [logEntry],
              },
            ],
          })}
        >
          <OverTime />
        </SymptomLogContext.Provider>,
      )

      fireEvent.press(getByLabelText("Edit"))
      expect(navigateSpy).toHaveBeenCalledWith(
        MyHealthStackScreens.SelectSymptoms,
        {
          logEntry: JSON.stringify(logEntry),
        },
      )
    })
  })
})
