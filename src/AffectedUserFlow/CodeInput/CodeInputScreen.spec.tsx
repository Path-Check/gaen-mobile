import React from "react"
import { render } from "@testing-library/react-native"
import "@testing-library/jest-native/extend-expect"

import CodeInputScreen from "./CodeInputScreen"
import { AffectedUserProvider } from "../AffectedUserContext"
import {
  PermissionsContext,
  ENPermissionStatus,
} from "../../Device/PermissionsContext"

jest.mock("@react-navigation/native")

describe("CodeInputScreen", () => {
  describe("when the user has exposure notifications enabled", () => {
    it("shows the CodeInputForm", () => {
      const isENAuthorizedAndEnabled = "Enabled"
      const permissionProviderValue = createPermissionProviderValue(
        isENAuthorizedAndEnabled,
      )

      const { getByTestId, queryByTestId } = render(
        <PermissionsContext.Provider value={permissionProviderValue}>
          <AffectedUserProvider>
            <CodeInputScreen />
          </AffectedUserProvider>
        </PermissionsContext.Provider>,
      )

      expect(getByTestId("affected-user-code-input-form")).not.toBeNull()
      expect(
        queryByTestId("affected-user-enable-expsosure-notifications-screen"),
      ).toBeNull()
    })
  })

  describe("when the user does not have exposure notifications enabled", () => {
    it("shows the EnableExposureNotifications screen", () => {
      const isEnAuthorizedAndEnabled = "Disabled"
      const permissionProviderValue = createPermissionProviderValue(
        isEnAuthorizedAndEnabled,
      )

      const { getByTestId, queryByTestId } = render(
        <PermissionsContext.Provider value={permissionProviderValue}>
          <AffectedUserProvider>
            <CodeInputScreen />
          </AffectedUserProvider>
        </PermissionsContext.Provider>,
      )

      expect(queryByTestId("affected-user-code-input-form")).toBeNull()
      expect(
        getByTestId("affected-user-enable-exposure-notifications-screen"),
      ).not.toBeNull()
    })
  })
})

const createPermissionProviderValue = (
  enPermissionStatus: ENPermissionStatus,
) => {
  return {
    isBluetoothOn: true,
    locationPermissions: "RequiredOn" as const,
    notification: {
      status: "Unknown" as const,
      check: () => {},
      request: () => {},
    },
    exposureNotifications: {
      status: enPermissionStatus,
      check: () => {},
      request: () =>
        Promise.resolve({
          kind: "failure" as const,
          error: "Unknown" as const,
        }),
    },
  }
}
