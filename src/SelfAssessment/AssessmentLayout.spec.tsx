import { render } from "@testing-library/react-native"
import React from "react"
import { View } from "react-native"

import { AssessmentLayout } from "./AssessmentLayout"

describe("AssessmentLayout", () => {
  it("renders it's children component", () => {
    const { getByTestId } = render(
      <AssessmentLayout backgroundColor="color" footer="ReactNode" icon="icon">
        <View testID="children" />
      </AssessmentLayout>,
    )
    expect(getByTestId("children")).toBeTruthy()
  })

  it("renders the footer component", () => {
    const { getByTestId } = render(
      <AssessmentLayout
        footer={<View testID="footer" />}
        backgroundColor="color"
        icon="icon"
      />,
    )
    expect(getByTestId("footer")).toBeTruthy()
  })
})
