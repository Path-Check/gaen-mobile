import React from "react"
import { fireEvent, render } from "@testing-library/react-native"
import { useNavigation } from "@react-navigation/native"

import { SelfAssessmentContext, SelfAssessmentProvider } from "./Context"
import { UnderlyingCondition } from "./selfAssessment"
import { factories } from "../factories"
import { SelfAssessmentStackScreens } from "../navigation"
import UnderlyingConditions from "./UnderlyingConditions"

jest.mock("@react-navigation/native")
describe("UnderlyingConditions", () => {
  describe("updating conditions", () => {
    it("calls the update function", () => {
      expect.assertions(1)

      const updateConditionsSpy = jest.fn()
      const context = factories.selfAssessmentContext.build({
        updateUnderlyingConditions: updateConditionsSpy,
      })

      const { getByText } = render(
        <SelfAssessmentContext.Provider value={context}>
          <UnderlyingConditions />
        </SelfAssessmentContext.Provider>,
      )

      const smokingCheckbox = getByText("Smoking")

      fireEvent.press(smokingCheckbox)
      expect(updateConditionsSpy).toHaveBeenCalledWith(
        UnderlyingCondition.SMOKING,
      )
    })
  })

  describe("clicking next", () => {
    it("navigates to the age rangescreen", () => {
      const navigationSpy = jest.fn()
      ;(useNavigation as jest.Mock).mockReturnValue({
        navigate: navigationSpy,
      })

      const { getByText } = render(
        <SelfAssessmentProvider>
          <UnderlyingConditions />
        </SelfAssessmentProvider>,
      )

      const nextButton = getByText("Next")

      fireEvent.press(nextButton)
      expect(navigationSpy).toHaveBeenCalledWith(
        SelfAssessmentStackScreens.AgeRange,
      )
    })
  })
})
