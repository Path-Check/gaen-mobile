import { useNavigation } from "@react-navigation/native"
import { fireEvent, render, waitFor } from "@testing-library/react-native"
import React from "react"
import { SelfScreenerStackScreens } from "../navigation"
import HowAreYouFeeling from "./HowAreYouFeeling"

jest.mock("@react-navigation/native")

describe("HowAreYouFeeling", () => {
  it("displays the screen header", () => {
    const { queryByText } = render(<HowAreYouFeeling />)

    expect(queryByText("How are you feeling?")).not.toBeNull()
  })

  describe("when the user taps the feeling good button", () => {
    it("navigates to the asymptomatic flow", async () => {
      const navigateSpy = jest.fn()
      ;(useNavigation as jest.Mock).mockReturnValue({
        navigate: navigateSpy,
      })
      const { getByLabelText } = render(<HowAreYouFeeling />)
      fireEvent.press(getByLabelText("Good"))
      await waitFor(() => {
        expect(navigateSpy).toHaveBeenCalledWith(
          SelfScreenerStackScreens.AsymptomaticFlowIntro,
        )
      })
    })
  })

  describe("when the user taps the not feeling good button", () => {
    it("navigates to the symptomatic flow", async () => {
      const navigateSpy = jest.fn()
      ;(useNavigation as jest.Mock).mockReturnValue({
        navigate: navigateSpy,
      })
      await waitFor(() => {
        const { getByLabelText } = render(<HowAreYouFeeling />)
        fireEvent.press(getByLabelText("Not well"))
        expect(navigateSpy).toHaveBeenCalledWith(
          SelfScreenerStackScreens.EmergencySymptomsQuestions,
        )
      })
    })
  })
})
