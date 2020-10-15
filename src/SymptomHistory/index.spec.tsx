import React from "react"
import { render } from "@testing-library/react-native"

import { SymptomHistoryContext } from "./SymptomHistoryContext"
import { Symptom } from "./symptom"

import SymptomHistory from "./index"
import { factories } from "../factories"

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
  describe("when given a symptom history", () => {
    it("renders the history", () => {
      const today = Date.parse("2020-1-3")
      const oneDayAgo = Date.parse("2020-1-2")
      const twoDaysAgo = Date.parse("2020-1-1")
      const history: SymptomHistory = [
        {
          kind: "NoData",
          date: today,
        },
        {
          id: "a",
          kind: "Symptoms",
          date: oneDayAgo,
          symptoms: new Set<Symptom>(),
        },
        {
          id: "b",
          kind: "Symptoms",
          date: twoDaysAgo,
          symptoms: new Set<Symptom>(["cough"]),
        },
      ]
      const { getByText, getAllByText } = render(
        <SymptomHistoryContext.Provider
          value={factories.symptomHistoryContext.build({
            symptomHistory: history,
          })}
        >
          <SymptomHistory />
        </SymptomHistoryContext.Provider>,
      )

      expect(getByText("Jan 1, 2020")).toBeDefined()
      expect(getAllByText("No Data")).toHaveLength(1)
      expect(getByText("Jan 2, 2020")).toBeDefined()
      expect(getAllByText("No Symptoms")).toHaveLength(1)
      expect(getByText("Jan 3, 2020")).toBeDefined()
      expect(getAllByText("cough")).toHaveLength(1)
    })
  })
})
