import React from "react"
import { render, fireEvent } from "@testing-library/react-native"
import { useNavigation } from "@react-navigation/native"

import Welcome from "./Welcome"

jest.mock("@react-navigation/native")

describe("Welcome", () => {
  it("continues when the user presses the get started button", () => {
    const navigationSpy = jest.fn()
    ;(useNavigation as jest.Mock).mockReturnValue({ navigate: navigationSpy })

    const { getByLabelText } = render(<Welcome />)
    const continueButton = getByLabelText("Get Started")
    fireEvent.press(continueButton)
    expect(navigationSpy).toHaveBeenCalledWith("HowItWorks")
  })
})
