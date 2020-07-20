import { render } from "@testing-library/react-native"
import React from "react"

import { Switch } from "./Switch"

describe("Switch", () => {
  it("initializes the switch with false as the default value", () => {
    const { getByTestId } = render(<Switch />)
    expect(getByTestId("switch").getProp("value")).toEqual(false)
  })

  it("initializes the switch with the provided value override", () => {
    const value = true
    const { getByTestId } = render(<Switch value={value} />)
    expect(getByTestId("switch").getProp("value")).toEqual(value)
  })
})
