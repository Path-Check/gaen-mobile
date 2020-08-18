import React from "react"
import { render, fireEvent } from "@testing-library/react-native"
import { useNavigation } from "@react-navigation/native"

import Complete from "./Complete"

jest.mock("@react-navigation/native")
describe("Complete", () => {
  it("displays information about completing the flow", () => {
    const { getByText } = render(<Complete />)
    expect(getByText("Thanks for keeping your community safe!")).toBeDefined()
    expect(
      getByText(
        "You’re helping contain the spread of the virus and protect others in your community.",
      ),
    ).toBeDefined()
  })

  it("navigates to the home screen when user press on done", () => {
    const navigateSpy = jest.fn()
    ;(useNavigation as jest.Mock).mockReturnValue({ navigate: navigateSpy })
    const { getByLabelText } = render(<Complete />)

    fireEvent.press(getByLabelText("Done"))
    expect(navigateSpy).toHaveBeenCalledWith("Home")
  })
})
