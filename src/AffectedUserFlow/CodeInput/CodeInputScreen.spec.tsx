import React from "react"
import { render } from "@testing-library/react-native"
import "@testing-library/jest-native/extend-expect"

import CodeInputScreen from "./CodeInputScreen"
import { AffectedUserProvider } from "../AffectedUserContext"
import {
  PermissionsContext,
  ENActivationStatus,
} from "../../PermissionsContext"
import { PermissionStatus } from "../../permissionStatus"

jest.mock("@react-navigation/native")

describe("CodeInputScreen", () => {
  describe("when the user has exposure notifications enabled", () => {
    it("shows the CodeInputForm", () => {
      const enPermissionStatus: ENActivationStatus = {
        authorization: true,
        enablement: true,
      }
      const permissionProviderValue = createPermissionProviderValue(
        enPermissionStatus,
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
      const enPermissionStatus: ENActivationStatus = {
        authorization: true,
        enablement: false,
      }
      const permissionProviderValue = createPermissionProviderValue(
        enPermissionStatus,
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
  enActivationStatus: ENActivationStatus,
) => {
  return {
    notification: {
      status: PermissionStatus.UNKNOWN,
      check: () => {},
      request: () => {},
    },
    exposureNotifications: {
      status: enActivationStatus,
      check: () => {},
      request: () => {},
    },
  }
}
