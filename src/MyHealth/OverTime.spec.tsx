import React from "react"
import { render } from "@testing-library/react-native"

import { SymptomLogContext } from "./SymptomLogContext"
import { HealthAssessment } from "./symptoms"

import OverTime from "./OverTime"
import { factories } from "../factories"

jest.mock("@react-navigation/native")

describe("OverTime", () => {
  describe("when the user has a not at risk log entry", () => {
    it("shows a 'feeling well' message", () => {
      const { getByText } = render(
        <SymptomLogContext.Provider
          value={factories.symptomLogContext.build({
            logEntries: [
              {
                id: 1,
                symptoms: [],
                healthAssessment: HealthAssessment.NotAtRisk,
                date: new Date().getTime() / 1000,
              },
            ],
          })}
        >
          <OverTime />
        </SymptomLogContext.Provider>,
      )

      expect(getByText("You were feeling well")).toBeDefined()
    })
  })

  describe("when the user has an at risk log entry", () => {
    it("shows a 'feeling not well' message", () => {
      const { getByText } = render(
        <SymptomLogContext.Provider
          value={factories.symptomLogContext.build({
            logEntries: [
              {
                id: 1,
                symptoms: [],
                healthAssessment: HealthAssessment.AtRisk,
                date: new Date().getTime() / 1000,
              },
            ],
          })}
        >
          <OverTime />
        </SymptomLogContext.Provider>,
      )

      expect(getByText("You were not feeling well")).toBeDefined()
    })
  })
})
