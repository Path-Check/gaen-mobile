import React from "react"
import { render, fireEvent, waitFor } from "@testing-library/react-native"
import { useNavigation } from "@react-navigation/native"

import { ModalStackScreens, Stacks } from "../navigation"

import HowAreYouFeeling from "./HowAreYouFeeling"
import { SymptomLogContext } from "./SymptomLogContext"
import { factories } from "../factories"

jest.mock("@react-navigation/native")
jest.mock("react-native-flash-message")

describe("HowAreYouFeeling", () => {
  it("prompts the user to check-in", () => {
    const { getByLabelText, getByText } = render(
      <SymptomLogContext.Provider value={factories.symptomLogContext.build()}>
        <HowAreYouFeeling />
      </SymptomLogContext.Provider>,
    )
    expect(getByLabelText("Good")).toBeDefined()
    expect(getByLabelText("Not well")).toBeDefined()
    expect(getByText("How are you feeling today?")).toBeDefined()
  })

  describe("when the user selects that they are not feeling well", () => {
    it("saves today check-in with the feeling not well status", async () => {
      const navigateSpy = jest.fn()
      ;(useNavigation as jest.Mock).mockReturnValue({
        navigate: navigateSpy,
      })
      const { getByLabelText } = render(
        <SymptomLogContext.Provider
          value={factories.symptomLogContext.build({})}
        >
          <HowAreYouFeeling />
        </SymptomLogContext.Provider>,
      )

      fireEvent.press(getByLabelText("Not well"))
      await waitFor(() => {
        expect(navigateSpy).toHaveBeenCalledWith(Stacks.Modal, {
          screen: ModalStackScreens.SelfScreenerFromMyHealth,
        })
      })
    })
  })
})
