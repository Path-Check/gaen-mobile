import React from "react"
import { render, fireEvent } from "@testing-library/react-native"

import CheckIn from "./CheckIn"

describe("CheckIn", () => {
  it("shows a glad to hear it message when the user says they feel good", () => {
    const { getByLabelText, getByText } = render(<CheckIn />)

    fireEvent.press(getByLabelText("Good"))
    expect(getByText("Glad to hear it!")).toBeDefined()
  })

  it("shows a sorry to hear you're not feeling well message when the user says they feel not well", () => {
    const { getByLabelText, getByText } = render(<CheckIn />)

    fireEvent.press(getByLabelText("Not well"))
    expect(getByText("Sorry to hear you're not feeling well!")).toBeDefined()
  })
})
