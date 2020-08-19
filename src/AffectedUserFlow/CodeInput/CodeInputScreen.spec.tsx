import React from "react"
import { render } from "@testing-library/react-native"
import "@testing-library/jest-native/extend-expect"

import CodeInputScreen from "./CodeInputScreen"
import { AffectedUserProvider } from "../AffectedUserContext"
import { TestModeProvider } from "../../TestModeContext"
import {
  PermissionsContext,
  ENPermissionStatus,
} from "../../PermissionsContext"
import { PermissionStatus } from "../../permissionStatus"

jest.mock("@react-navigation/native")

describe("CodeInputScreen", () => {
  describe("when the user has exposure notifications enabled", () => {
    it("shows the CodeInputForm", () => {
      const enPermissionStatus: ENPermissionStatus = ["AUTHORIZED", "ENABLED"]
      const permissionProviderValue = createPermissionProviderValue(
        enPermissionStatus,
      )

      const { getByTestId, queryByTestId } = render(
        <TestModeProvider>
          <PermissionsContext.Provider value={permissionProviderValue}>
            <AffectedUserProvider>
              <CodeInputScreen />
            </AffectedUserProvider>
          </PermissionsContext.Provider>
        </TestModeProvider>,
      )

      expect(getByTestId("affected-user-code-input-form")).not.toBeNull()
      expect(
        queryByTestId("affected-user-enable-expsosure-notifications-screen"),
      ).toBeNull()
    })
  })

  describe("when the user does not have exposure notifications enabled", () => {
    it("shows the EnableExposureNotifications screen", () => {
      const enPermissionStatus: ENPermissionStatus = ["AUTHORIZED", "DISABLED"]
      const permissionProviderValue = createPermissionProviderValue(
        enPermissionStatus,
      )

      const { getByTestId, queryByTestId } = render(
        <TestModeProvider>
          <PermissionsContext.Provider value={permissionProviderValue}>
            <AffectedUserProvider>
              <CodeInputScreen />
            </AffectedUserProvider>
          </PermissionsContext.Provider>
        </TestModeProvider>,
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
    notification: {
      status: PermissionStatus.UNKNOWN,
      check: () => {},
      request: () => {},
    },
    exposureNotifications: {
      status: enPermissionStatus,
      check: () => {},
      request: () => {},
    },
  }
}
