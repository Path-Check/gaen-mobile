import { render, fireEvent } from "@testing-library/react-native"
import React from "react"

import { Button } from "./Button"

describe("Button", () => {
  it("displays a button with a title and responds to tap events", () => {
    const buttonTitle = "button title"
    const onPressSpy = jest.fn()

    const { getByText } = render(
      <Button title={buttonTitle} onPress={onPressSpy} />,
    )
    fireEvent.press(getByText(buttonTitle))

    expect(onPressSpy).toHaveBeenCalled()
  })

  it("does not respond to press events on a disabled button", () => {
    const onPressSpy = jest.fn()

    const { getByTestId } = render(
      <Button disabled title="title" onPress={onPressSpy} />,
    )
    fireEvent.press(getByTestId("assessment-button"))

    expect(onPressSpy).not.toHaveBeenCalled()
  })
})
