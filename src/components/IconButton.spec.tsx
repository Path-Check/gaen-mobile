import { render, fireEvent } from "@testing-library/react-native"
import React from "react"

import { IconButton } from "./IconButton"

describe("IconButton", () => {
  it("delegates the onPress handler", () => {
    const onPressSpy = jest.fn()
    const accessibilityLabel = "accessibilityLabel"

    const { getByLabelText } = render(
      <IconButton
        onPress={onPressSpy}
        accessibilityLabel={accessibilityLabel}
        icon="<g />"
      />,
    )

    fireEvent.press(getByLabelText(accessibilityLabel))
    expect(onPressSpy).toHaveBeenCalled()
  })

  it("customizes the inner svg", () => {
    const color = "white"
    const size = 10

    const { getByTestId } = render(
      <IconButton icon="<g />" size={size} color={color} />,
    )

    const innerSvg = getByTestId("icon-button-svg")

    expect(innerSvg.getProp("width")).toEqual(size)
    expect(innerSvg.getProp("height")).toEqual(size)
    expect(innerSvg.getProp("color")).toEqual(color)
  })
})
