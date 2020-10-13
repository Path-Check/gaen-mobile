import React from "react"
import { fireEvent, render, waitFor } from "@testing-library/react-native"
import { useNavigation } from "@react-navigation/native"

import { SymptomLogContext } from "./SymptomLogContext"
import { SymptomLogEntry } from "./symptoms"

import SymptomLog from "./index"
import { factories } from "../factories"
import { posixToDayjs } from "../utils/dateTime"
import { MyHealthStackScreens } from "../navigation"

jest.mock("@react-navigation/native")

describe("SymptomLog", () => {
  it("allows the user to add a symptom log entry", async () => {
    const navigateSpy = jest.fn()
    ;(useNavigation as jest.Mock).mockReturnValue({
      navigate: navigateSpy,
    })
    const defaultContext = factories.symptomLogContext.build()
    const { getByLabelText } = render(
      <SymptomLogContext.Provider value={defaultContext}>
        <SymptomLog />
      </SymptomLogContext.Provider>,
    )

    fireEvent.press(getByLabelText("Log symptoms"))

    await waitFor(() => {
      expect(navigateSpy).toHaveBeenCalledWith(
        MyHealthStackScreens.SelectSymptoms,
      )
    })
  })

  describe("when the user has no symptom logs", () => {
    it("displays a 'no logs' message", () => {
      const { getByText } = render(
        <SymptomLogContext.Provider
          value={factories.symptomLogContext.build({
            symptomLogEntries: [],
          })}
        >
          <SymptomLog />
        </SymptomLogContext.Provider>,
      )

      expect(getByText("No symptom history…")).toBeDefined()
    })
  })

  describe("when the user has log data", () => {
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
      const { getByText, queryByText, getAllByText } = render(
        <SymptomLogContext.Provider
          value={factories.symptomLogContext.build({
            symptomLogEntries: [
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
          })}
        >
          <SymptomLog />
        </SymptomLogContext.Provider>,
      )

      expect(queryByText("You were not feeling well")).toBeNull()
      expect(getAllByText(dateString)).toHaveLength(2)
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
            symptomLogEntries: [logEntry],
          })}
        >
          <SymptomLog />
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
