import React from "react"
import { openAppSettings } from "../../gaen/nativeModule"
import { render, fireEvent } from "@testing-library/react-native"

import EnableExposureNotifications from "./EnableExposureNotifications"

jest.mock("../../gaen/nativeModule")
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
  it("takes user to system settings if decide to activate notifications", () => {
    const { getByLabelText } = render(<EnableExposureNotifications />)

    fireEvent.press(getByLabelText("Open Settings"))
    expect(openAppSettings).toHaveBeenCalled()
  })
})
