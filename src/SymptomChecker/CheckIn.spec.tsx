import React from "react"
import { render, fireEvent } from "@testing-library/react-native"
import { useNavigation } from "@react-navigation/native"

import { SymptomCheckerStackScreens } from "../navigation"

import CheckIn from "./CheckIn"

jest.mock("@react-navigation/native")

describe("CheckIn", () => {
  it("shows a glad to hear it message when the user says they feel good", () => {
    const { getByLabelText, getByText } = render(<CheckIn />)

    fireEvent.press(getByLabelText("Good"))
    expect(getByText("Glad to hear it!")).toBeDefined()
  })

  it("shows a sorry to hear you're not feeling well message when the user says they feel not well", () => {
    const navigateSpy = jest.fn()
    ;(useNavigation as jest.Mock).mockReturnValue({
      navigate: navigateSpy,
    })

    const { getByLabelText } = render(<CheckIn />)

    fireEvent.press(getByLabelText("Not well"))
    expect(navigateSpy).toHaveBeenCalledWith(
      SymptomCheckerStackScreens.SelectSymptoms,
    )
  })
})
