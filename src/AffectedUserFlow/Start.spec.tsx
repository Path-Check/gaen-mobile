import React from "react"
import { render, fireEvent } from "@testing-library/react-native"
import { useNavigation } from "@react-navigation/native"

import Start from "./Start"

jest.mock("@react-navigation/native")
describe("Start", () => {
  it("displays information about sharing information through the flow", () => {
    const { getByText } = render(<Start />)
    expect(
      getByText(
        "Help contain the spread of the virus and protect others in your community if you're diagnosed or test positive for COVID-19.",
      ),
    ).toBeDefined()
    expect(
      getByText(
        "Choose to anonymously notify others you may have encountered and help your community contain the spread of the virus.",
      ),
    ).toBeDefined()
  })

  it("navigates to the code input screen when user starts the flow", () => {
    const navigateSpy = jest.fn()
    ;(useNavigation as jest.Mock).mockReturnValue({ navigate: navigateSpy })
    const { getByLabelText } = render(<Start />)

    fireEvent.press(getByLabelText("Start"))
    expect(navigateSpy).toHaveBeenCalledWith("AffectedUserCodeInput")
  })
})
