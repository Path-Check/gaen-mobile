import React from "react"
import { render } from "@testing-library/react-native"

import EnableExposureNotifications from "./EnableExposureNotifications"

jest.mock("../../Device/nativeModule")
jest.mock("../../useRequestExposureNotifications")
jest.mock("@react-navigation/native")

describe("EnableExposureNotifications", () => {
  it("displays the explanations for the exposure notifications", () => {
    const { getByText } = render(<EnableExposureNotifications />)
    expect(
      getByText(
        "You must enable exposure notifications to report a positive test result.",
      ),
    ).toBeDefined()
    expect(getByText("Enable exposure notifications to continue")).toBeDefined()
  })

  it("provides a button to enable exposure notifications", async () => {
    const { getByLabelText } = render(<EnableExposureNotifications />)
    expect(getByLabelText("Enable Exposure Notifications")).not.toBeNull()
  })
})
