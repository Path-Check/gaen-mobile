import React from "react"
import { render, fireEvent } from "@testing-library/react-native"
import { useNavigation } from "@react-navigation/native"

import Start from "./Start"

jest.mock("@react-navigation/native")
describe("Start", () => {
  it("navigates to the code input screen when user starts the flow", () => {
    const navigateSpy = jest.fn()
    ;(useNavigation as jest.Mock).mockReturnValue({ navigate: navigateSpy })
    const { getByLabelText } = render(<Start />)

    fireEvent.press(getByLabelText("Continue"))
    expect(navigateSpy).toHaveBeenCalledWith("AffectedUserCodeInput")
  })
})
