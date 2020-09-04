import React from "react"
import { render } from "@testing-library/react-native"
import "@testing-library/jest-native/extend-expect"

import CodeInputScreen from "./CodeInputScreen"
import { AffectedUserProvider } from "../AffectedUserContext"
import { PermissionsContext, ENStatus } from "../../PermissionsContext"
import { PermissionStatus } from "../../permissionStatus"

jest.mock("@react-navigation/native")

describe("CodeInputScreen", () => {
  describe("when the user has exposure notifications enabled", () => {
    it("shows the CodeInputForm", () => {
      const isENAuthorizedAndEnabled = ENStatus.AUTHORIZED_ENABLED
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
      const isEnAuthorizedAndEnabled = ENStatus.AUTHORIZED_DISABLED
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

const createPermissionProviderValue = (enStatus: ENStatus) => {
  return {
    notification: {
      status: PermissionStatus.UNKNOWN,
      check: () => {},
      request: () => {},
    },
    exposureNotifications: {
      status: enStatus,
      check: () => {},
      request: () => Promise.resolve(),
    },
  }
}
