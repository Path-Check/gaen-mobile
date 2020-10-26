import React from "react"
import { fireEvent, render } from "@testing-library/react-native"
import { Share } from "react-native"
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
          kind: "NoUserInput",
          date: today,
        },
        {
          id: "a",
          kind: "UserInput",
          date: oneDayAgo,
          symptoms: new Set<Symptom>(),
        },
        {
          id: "b",
          kind: "UserInput",
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

      const expectedTodayText = dayjs(today).local().format("MMM D, 'YY")
      const expectedOneDayAgoText = dayjs(oneDayAgo)
        .local()
        .format("MMM D, 'YY")
      const expectedTwoDaysAgoText = dayjs(twoDaysAgo)
        .local()
        .format("MMM D, 'YY")
      expect(getByText(expectedTodayText)).toBeDefined()
      expect(getAllByText("No entry")).toHaveLength(1)
      expect(getByText(expectedOneDayAgoText)).toBeDefined()
      expect(getAllByText("You felt well")).toHaveLength(1)
      expect(getByText(expectedTwoDaysAgoText)).toBeDefined()
      expect(getAllByText("• Cough")).toHaveLength(1)
    })

    it("allows the user to share their symptom history", () => {
      const today = Date.parse("2020-1-3")
      const oneDayAgo = Date.parse("2020-1-2")
      const twoDaysAgo = Date.parse("2020-1-1")
      const history: SymptomHistory = [
        {
          kind: "NoUserInput",
          date: today,
        },
        {
          id: "a",
          kind: "UserInput",
          date: oneDayAgo,
          symptoms: new Set<Symptom>(),
        },
        {
          id: "b",
          kind: "UserInput",
          date: twoDaysAgo,
          symptoms: new Set<Symptom>(["cough", "fever"]),
        },
      ]
      const shareSpy = jest.spyOn(Share, "share")
      const { getByTestId } = render(
        <SymptomHistoryContext.Provider
          value={factories.symptomHistoryContext.build({
            symptomHistory: history,
          })}
        >
          <SymptomHistoryScreen />
        </SymptomHistoryContext.Provider>,
      )

      const shareButton = getByTestId("shareButton")
      fireEvent.press(shareButton)

      expect(shareSpy).toHaveBeenCalledWith({
        message:
          "Symptom history from Jan 3, '20 to Jan 1, '20\n\nJan 3, '20\nNo symptoms were logged\n\nJan 2, '20\nYou felt well\n\nJan 1, '20\nYou did not feel well, symptoms included: Cough, Fever",
      })
    })
  })
})
