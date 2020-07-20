import { render } from "@testing-library/react-native"
import React from "react"
import { View } from "react-native"

import { Info } from "./Info"

describe("Info", () => {
  it("renders it's children component", () => {
    const { getByTestId } = render(
      <Info>
        <View testID="children" />
      </Info>,
    )
    expect(getByTestId("children")).toBeTruthy()
  })

  it("renders the footer component", () => {
    const { getByTestId } = render(<Info footer={<View testID="footer" />} />)
    expect(getByTestId("footer")).toBeTruthy()
  })
})
