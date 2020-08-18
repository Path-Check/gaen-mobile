import React from "react"
import { Linking } from "react-native"
import { render, fireEvent } from "@testing-library/react-native"
import { useNavigation } from "@react-navigation/native"

import EnableExposureNotifications from "./EnableExposureNotifications"

jest.mock("@react-navigation/native")
describe("EnableExposureNotifications", () => {
  it("displays the explanations for the exposure notifications", () => {
    const { getByText } = render(<EnableExposureNotifications />)
    expect(
      getByText(
        "You must enable exposure notifcations to report a positive test result.",
      ),
    ).toBeDefined()
    expect(getByText("Enable exposure notifications to continue")).toBeDefined()
  })

  it("navigates to the home screen if users cancels", () => {
    const navigateSpy = jest.fn()
    ;(useNavigation as jest.Mock).mockReturnValue({ navigate: navigateSpy })
    const { getByLabelText } = render(<EnableExposureNotifications />)

    fireEvent.press(getByLabelText("Cancel"))
    expect(navigateSpy).toHaveBeenCalledWith("Home")
  })

  it("takes user to system settings if decide to activate notifications", () => {
    const openSettingsSpy = jest.spyOn(Linking, "openSettings")
    const { getByLabelText } = render(<EnableExposureNotifications />)

    fireEvent.press(getByLabelText("Open Settings"))
    expect(openSettingsSpy).toHaveBeenCalled()
  })
})
