import React from "react"
import { fireEvent, render, waitFor } from "@testing-library/react-native"
import { useNavigation } from "@react-navigation/native"

import { SymptomHistoryContext } from "./SymptomHistoryContext"
import { SymptomEntry } from "./symptoms"

import SymptomHistory from "./index"
import { factories } from "../factories"
import { posixToDayjs } from "../utils/dateTime"
import { SymptomHistoryStackScreens } from "../navigation"

jest.mock("@react-navigation/native")

describe("SymptomHistory", () => {
  it("allows the user to add a symptom log entry", async () => {
    const navigateSpy = jest.fn()
    ;(useNavigation as jest.Mock).mockReturnValue({
      navigate: navigateSpy,
    })
    const defaultContext = factories.symptomHistoryContext.build()
    const { getByLabelText } = render(
      <SymptomHistoryContext.Provider value={defaultContext}>
        <SymptomHistory />
      </SymptomHistoryContext.Provider>,
    )

    fireEvent.press(getByLabelText("Log symptoms"))

    await waitFor(() => {
      expect(navigateSpy).toHaveBeenCalledWith(
        SymptomHistoryStackScreens.SelectSymptoms,
      )
    })
  })

  describe("when the user has no symptom logs", () => {
    it("displays a 'no logs' message", () => {
      const { getByText } = render(
        <SymptomHistoryContext.Provider
          value={factories.symptomHistoryContext.build({
            symptomHistory: [],
          })}
        >
          <SymptomHistory />
        </SymptomHistoryContext.Provider>,
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
        <SymptomHistoryContext.Provider
          value={factories.symptomHistoryContext.build({
            symptomHistory: [
              {
                id: "1",
                kind: "Symptoms",
                symptoms: new Set(["cough"]),
                date: firstLogEntryPosix,
              },
              {
                id: "2",
                kind: "Symptoms",
                symptoms: new Set(["loss_of_smell"]),
                date: secondLogEntryPosix,
              },
            ],
          })}
        >
          <SymptomHistory />
        </SymptomHistoryContext.Provider>,
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
      const logEntry: SymptomEntry = {
        id: "1",
        kind: "Symptoms",
        symptoms: new Set(["cough"]),
        date: logEntryPosix,
      }
      const { getByLabelText } = render(
        <SymptomHistoryContext.Provider
          value={factories.symptomHistoryContext.build({
            symptomHistory: [logEntry],
          })}
        >
          <SymptomHistory />
        </SymptomHistoryContext.Provider>,
      )

      fireEvent.press(getByLabelText("Edit"))
      expect(navigateSpy).toHaveBeenCalledWith(
        SymptomHistoryStackScreens.SelectSymptoms,
        {
          logEntry: JSON.stringify(logEntry),
        },
      )
    })
  })
})
