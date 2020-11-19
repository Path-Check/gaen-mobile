import React from "react"
import { render, fireEvent, waitFor } from "@testing-library/react-native"
import { useNavigation } from "@react-navigation/native"

import {
  PermissionsContext,
  PermissionsContextState,
} from "../Device/PermissionsContext"
import { ActivationStackScreens } from "../navigation"
import NotificationPermissions from "./NotificationPermissions"

jest.mock("@react-navigation/native")

describe("NotificationPermissions", () => {
  describe("when a user enables notifications,", () => {
    it("requests permissions", () => {
      const notificationRequestSpy = jest.fn()
      const permissionsProviderValue = createPermissionProviderValue(
        notificationRequestSpy,
      )

      const { getByLabelText } = render(
        <PermissionsContext.Provider value={permissionsProviderValue}>
          <NotificationPermissions />
        </PermissionsContext.Provider>,
      )

      fireEvent.press(getByLabelText("Enable Notifications"))

      expect(notificationRequestSpy).toHaveBeenCalled()
    })
    it("navigates to the next screen", async () => {
      expect.assertions(1)
      const navigationSpy = jest.fn()
      ;(useNavigation as jest.Mock).mockReturnValue({
        navigate: navigationSpy,
      })

      const { getByLabelText } = render(<NotificationPermissions />)

      fireEvent.press(getByLabelText("Enable Notifications"))

      await waitFor(() => {
        expect(navigationSpy).toHaveBeenCalledWith(
          ActivationStackScreens.ActivationSummary,
        )
      })
    })
  })
  describe("when a user does not enable notifications", () => {
    it("does not request permissions", () => {
      const notificationRequestSpy = jest.fn()
      const permissionsProviderValue = createPermissionProviderValue(
        notificationRequestSpy,
      )

      const { getByText } = render(
        <PermissionsContext.Provider value={permissionsProviderValue}>
          <NotificationPermissions />
        </PermissionsContext.Provider>,
      )

      fireEvent.press(getByText("Maybe later"))

      expect(notificationRequestSpy).not.toHaveBeenCalled()
    })
    it("navigates to the next screen", () => {
      const navigationSpy = jest.fn()
      ;(useNavigation as jest.Mock).mockReturnValue({ navigate: navigationSpy })

      const { getByText } = render(<NotificationPermissions />)

      fireEvent.press(getByText("Maybe later"))

      expect(navigationSpy).toHaveBeenCalledWith(
        ActivationStackScreens.ActivationSummary,
      )
    })
  })
})

const createPermissionProviderValue = (
  requestPermission: () => void = () => {},
): PermissionsContextState => {
  return {
    isBluetoothOn: true,
    locationPermissions: "RequiredOn" as const,
    notification: {
      status: "Unknown" as const,
      check: () => {},
      request: requestPermission,
    },
    exposureNotifications: {
      status: "Enabled",
      request: () =>
        Promise.resolve({
          kind: "failure" as const,
          error: "Unknown" as const,
        }),
    },
  }
}
