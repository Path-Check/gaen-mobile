import React from "react"
import { render, fireEvent } from "@testing-library/react-native"
import { useNavigation } from "@react-navigation/native"

import { MyHealthStackScreens } from "../navigation"

import Today from "./Today"

jest.mock("@react-navigation/native")

describe("Today", () => {
  it("shows a glad to hear it message when the user says they feel good", () => {
    const { getByLabelText, getByText } = render(<Today />)

    fireEvent.press(getByLabelText("Good"))
    expect(getByText("Glad to hear it!")).toBeDefined()
  })

  it("shows a sorry to hear you're not feeling well message when the user says they feel not well", () => {
    const navigateSpy = jest.fn()
    ;(useNavigation as jest.Mock).mockReturnValue({
      navigate: navigateSpy,
    })

    const { getByLabelText } = render(<Today />)

    fireEvent.press(getByLabelText("Not well"))
    expect(navigateSpy).toHaveBeenCalledWith(
      MyHealthStackScreens.SelectSymptoms,
    )
  })
})
