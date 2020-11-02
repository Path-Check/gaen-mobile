import React from "react"
import { fireEvent, render } from "@testing-library/react-native"
import { useNavigation } from "@react-navigation/native"

import { SelfAssessmentContext } from "./Context"
import GeneralSymptoms from "./GeneralSymptoms"
import { PrimarySymptom, SecondarySymptom } from "./selfAssessment"
import { factories } from "../factories"
import { SelfAssessmentStackScreens } from "../navigation"

jest.mock("@react-navigation/native")
describe("GeneralSymptoms", () => {
  describe("updating symptoms", () => {
    it("calls the update function", () => {
      expect.assertions(1)
      const updateSymptomsSpy = jest.fn()
      const context = factories.selfAssessmentContext.build({
        updateSymptoms: updateSymptomsSpy,
      })

      const { getByText } = render(
        <SelfAssessmentContext.Provider value={context}>
          <GeneralSymptoms />
        </SelfAssessmentContext.Provider>,
      )

      const achingCheckbox = getByText("Aching throughout the body")

      fireEvent.press(achingCheckbox)
      expect(updateSymptomsSpy).toHaveBeenCalledWith(SecondarySymptom.ACHING)
    })
  })

  describe("pressing next", () => {
    it("navigates to the summary screen", () => {
      const navigationSpy = jest.fn()
      ;(useNavigation as jest.Mock).mockReturnValue({
        navigate: navigationSpy,
      })
      const context = factories.selfAssessmentContext.build({
        primarySymptoms: [PrimarySymptom.COUGH],
      })

      const { getByText } = render(
        <SelfAssessmentContext.Provider value={context}>
          <GeneralSymptoms />
        </SelfAssessmentContext.Provider>,
      )

      const nextButton = getByText("Next")

      fireEvent.press(nextButton)
      expect(navigationSpy).toHaveBeenCalledWith(
        SelfAssessmentStackScreens.UnderlyingConditions,
      )
    })
  })
})
