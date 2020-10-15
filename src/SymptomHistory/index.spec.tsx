import React from "react"
import { fireEvent, render } from "@testing-library/react-native"
import { useNavigation } from "@react-navigation/native"

import { SymptomHistoryContext } from "./SymptomHistoryContext"
import { SymptomEntry } from "./symptomHistory"

import SymptomHistory from "./index"
import { factories } from "../factories"
import { posixToDayjs } from "../utils/dateTime"
import { SymptomHistoryStackScreens } from "../navigation"

jest.mock("@react-navigation/native")

// as a user,
// when i am on the symptom history screen
// i see the last 14 days of my symptom history.
// the are all blank and indicate that i have no data.
// I tap a date card
// I see a sympotom form
// I fill the sympotom form out with some symptom
// I hit sav
// i see a success message
// I am navigated to the history screen.
// I see the correct symptoms on the correct day.
//

//when the suer has no entries
//it shows 14 days of blank stuff
//
//When the user has some days entered
//it shows the correct card with the correct sympotomHistoryStackScreen
//
//
//when the user taps a card the select sympotom screen opens with the correct sympotoms pre filled
//
describe("SymptomHistory", () => {
  describe("when the user has not enterd any symptoms for a day", () => {
    it("shows the last 14 days of entries and they all say 'no data'", () => {
      const dateString = "September 21, 2020"
      const firstLogEntryPosix = Date.parse(`2020-09-21 10:00`)
      const firstTimeString =
        posixToDayjs(firstLogEntryPosix)?.local()?.format("HH:mm A") ||
        "not a date"
      const secondLogEntryPosix = Date.parse(`${dateString} 12:00`)
      const secondTimeString =
        posixToDayjs(secondLogEntryPosix)?.local()?.format("HH:mm A") ||
        "not a date"
      const { getByText, getAllByText } = render(
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

      expect(getAllByText(dateString)).toHaveLength(2)
      expect(getByText(firstTimeString)).toBeDefined()
      expect(getByText(secondTimeString)).toBeDefined()
      expect(getByText("Cough")).toBeDefined()
      expect(getByText("Loss of smell")).toBeDefined()
    })
  })

  describe("when the user previoused created symptom entries", () => {
    it("shows the symptom entries in the correct day with the correct symptoms", () => {
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
