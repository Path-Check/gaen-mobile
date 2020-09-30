import React from "react"
import { fireEvent, render } from "@testing-library/react-native"
import { useNavigation } from "@react-navigation/native"

import { SelfScreenerContext } from "../SelfScreenerContext"
import GeneralSymptoms from "./GeneralSymptoms"
import { PrimarySymptom, SecondarySymptom } from "./selfScreener"
import { factories } from "../factories"
import { SelfScreenerStackScreens } from "../navigation"

jest.mock("@react-navigation/native")
describe("GeneralSymptoms", () => {
  describe("updating symptoms", () => {
    it("calls the update function", () => {
      expect.assertions(1)
      const updateSymptomsSpy = jest.fn()
      const context = factories.selfScreenerContext.build({
        updateSymptoms: updateSymptomsSpy,
      })

      const { getByText } = render(
        <SelfScreenerContext.Provider value={context}>
          <GeneralSymptoms />
        </SelfScreenerContext.Provider>,
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
      const context = factories.selfScreenerContext.build({
        primarySymptoms: [PrimarySymptom.COUGH],
      })

      const { getByText } = render(
        <SelfScreenerContext.Provider value={context}>
          <GeneralSymptoms />
        </SelfScreenerContext.Provider>,
      )

      const nextButton = getByText("Next")

      fireEvent.press(nextButton)
      expect(navigationSpy).toHaveBeenCalledWith(
        SelfScreenerStackScreens.GeneralSymptomsSummary,
      )
    })
  })
})
