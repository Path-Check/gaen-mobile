import React from "react"
import { render, wait, fireEvent } from "@testing-library/react-native"
import "@testing-library/jest-native/extend-expect"
import { useNavigation } from "@react-navigation/native"

import EnableExposureNotifications from "./EnableExposureNotifications"

jest.mock("@react-navigation/native")
;(useNavigation as jest.Mock).mockReturnValue({ navigate: jest.fn() })

describe("EnableExposureNotifications", () => {
  it("it renders an Enable Notifications button which requests permissions", async () => {
    const requestPermission = jest.fn()

    const { getByTestId } = render(
      <EnableExposureNotifications requestPermission={requestPermission} />,
    )

    const button = getByTestId("affected-user-request-permissions-button")

    fireEvent.press(button)
    await wait(() => {
      expect(requestPermission).toHaveBeenCalled()
    })
  })
})
