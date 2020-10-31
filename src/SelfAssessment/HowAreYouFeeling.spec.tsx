import React from "react"
import { useNavigation } from "@react-navigation/native"
import { fireEvent, render } from "@testing-library/react-native"

import { SelfAssessmentContext } from "./Context"
import { SelfAssessmentStackScreens } from "../navigation"
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
      const context = factories.selfAssessmentContext.build({
        clearSymptoms: clearSymptomsSpy,
      })

      const { getByLabelText } = render(
        <SelfAssessmentContext.Provider value={context}>
          <HowAreYouFeeling />
        </SelfAssessmentContext.Provider>,
      )
      fireEvent.press(getByLabelText("Good"))
      expect(navigateSpy).toHaveBeenCalledWith(
        SelfAssessmentStackScreens.Guidance,
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
        SelfAssessmentStackScreens.EmergencySymptomsQuestions,
      )
    })
  })
})
