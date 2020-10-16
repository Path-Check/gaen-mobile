import React from "react"
import { render } from "@testing-library/react-native"
import dayjs from "dayjs"

import { SymptomHistoryContext } from "./SymptomHistoryContext"
import { SymptomHistory } from "./symptomHistory"
import { Symptom } from "./symptom"

import SymptomHistoryScreen from "./index"
import { factories } from "../factories"

jest.mock("@react-navigation/native")
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
          <SymptomHistoryScreen />
        </SymptomHistoryContext.Provider>,
      )

      const expectedTodayText = dayjs(today).local().format("MMMM D, YYYY")
      const expectedOneDayAgoText = dayjs(oneDayAgo)
        .local()
        .format("MMMM D, YYYY")
      const expectedTwoDaysAgoText = dayjs(twoDaysAgo)
        .local()
        .format("MMMM D, YYYY")
      expect(getByText(expectedTodayText)).toBeDefined()
      expect(getAllByText("No data")).toHaveLength(1)
      expect(getByText(expectedOneDayAgoText)).toBeDefined()
      expect(getAllByText("No symptoms")).toHaveLength(1)
      expect(getByText(expectedTwoDaysAgoText)).toBeDefined()
      expect(getAllByText("Cough")).toHaveLength(1)
    })
  })
})
