import React from "react"
import { render, fireEvent, waitFor } from "@testing-library/react-native"
import { useNavigation } from "@react-navigation/native"

import {
  PermissionsContext,
  PermissionsContextState,
  ENPermissionStatus,
} from "../PermissionsContext"
import { PermissionStatus } from "../permissionStatus"
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
    it("navigates to the activation summary", async () => {
      expect.assertions(1)
      const navigationSpy = jest.fn()
      ;(useNavigation as jest.Mock).mockReturnValue({
        navigate: navigationSpy,
      })

      const { getByLabelText } = render(<NotificationPermissions />)

      fireEvent.press(getByLabelText("Enable Notifications"))

      await waitFor(() => {
        expect(navigationSpy).toHaveBeenCalledWith("ActivationSummary")
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
    it("navigates to the activation summary", () => {
      const navigationSpy = jest.fn()
      ;(useNavigation as jest.Mock).mockReturnValue({ navigate: navigationSpy })

      const { getByText } = render(<NotificationPermissions />)

      fireEvent.press(getByText("Maybe later"))

      expect(navigationSpy).toHaveBeenCalledWith("ActivationSummary")
    })
  })
})

const createPermissionProviderValue = (
  requestPermission: () => void = () => {},
): PermissionsContextState => {
  return {
    notification: {
      status: PermissionStatus.UNKNOWN,
      check: () => {},
      request: requestPermission,
    },
    exposureNotifications: {
      status: ENPermissionStatus.ENABLED,
      check: () => {},
      request: () => Promise.resolve(),
    },
  }
}
