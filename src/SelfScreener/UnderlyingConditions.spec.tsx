import React from "react"
import { fireEvent, render } from "@testing-library/react-native"
import { useNavigation } from "@react-navigation/native"

import {
  SelfScreenerContext,
  SelfScreenerProvider,
} from "../SelfScreenerContext"
import { UnderlyingCondition } from "./selfScreener"
import { factories } from "../factories"
import { SelfScreenerStackScreens } from "../navigation"
import UnderlyingConditions from "./UnderlyingConditions"

jest.mock("@react-navigation/native")
describe("UnderlyingConditions", () => {
  describe("updating conditions", () => {
    it("calls the update function", () => {
      expect.assertions(1)

      const updateConditionsSpy = jest.fn()
      const context = factories.selfScreenerContext.build({
        updateUnderlyingConditions: updateConditionsSpy,
      })

      const { getByText } = render(
        <SelfScreenerContext.Provider value={context}>
          <UnderlyingConditions />
        </SelfScreenerContext.Provider>,
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
        <SelfScreenerProvider>
          <UnderlyingConditions />
        </SelfScreenerProvider>,
      )

      const nextButton = getByText("Next")

      fireEvent.press(nextButton)
      expect(navigationSpy).toHaveBeenCalledWith(
        SelfScreenerStackScreens.AgeRange,
      )
    })
  })
})
