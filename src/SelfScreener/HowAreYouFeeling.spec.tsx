import { useNavigation } from "@react-navigation/native"
import { fireEvent, render } from "@testing-library/react-native"
import React from "react"
import { SelfScreenerContext } from "../SelfScreenerContext"
import { SelfScreenerStackScreens } from "../navigation"
import HowAreYouFeeling from "./HowAreYouFeeling"
import { factories } from "../factories"

jest.mock("@react-navigation/native")

describe("HowAreYouFeeling", () => {
  describe("when the user taps the feeling good button", () => {
    it("clears the symptoms and navigates to the guidence screen", () => {
      const navigateSpy = jest.fn()
      ;(useNavigation as jest.Mock).mockReturnValue({
        navigate: navigateSpy,
      })
      const clearSymptomsSpy = jest.fn()
      const context = factories.selfScreenerContext.build({
        clearSymptoms: clearSymptomsSpy,
      })

      const { getByLabelText } = render(
        <SelfScreenerContext.Provider value={context}>
          <HowAreYouFeeling />
        </SelfScreenerContext.Provider>,
      )
      fireEvent.press(getByLabelText("Good"))
      expect(navigateSpy).toHaveBeenCalledWith(
        SelfScreenerStackScreens.Guidance,
      )
      expect(clearSymptomsSpy).toHaveBeenCalled()
    })
  })

  describe("when the user taps the not feeling good button", () => {
    it("navigates to the symptomatic flow", () => {
      const navigateSpy = jest.fn()
      ;(useNavigation as jest.Mock).mockReturnValue({
        navigate: navigateSpy,
      })
      const { getByLabelText } = render(<HowAreYouFeeling />)
      fireEvent.press(getByLabelText("Not well"))
      expect(navigateSpy).toHaveBeenCalledWith(
        SelfScreenerStackScreens.EmergencySymptomsQuestions,
      )
    })
  })
})
