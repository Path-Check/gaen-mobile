import React from "react"
import { render, fireEvent } from "@testing-library/react-native"
import { useNavigation } from "@react-navigation/native"
import "@testing-library/jest-native/extend-expect"

import Home from "./index"
import { HomeStackScreens } from "../navigation"
import { factories } from "../factories"
import { Share } from "react-native"
import { ConfigurationContext } from "../ConfigurationContext"
import { ENPermissionStatus, PermissionsContext } from "../PermissionsContext"
import { SystemServicesContext } from "../SystemServicesContext"
import { PermissionStatus } from "../permissionStatus"

jest.mock("@react-navigation/native")

const mockedApplicationName = "applicationName"
jest.mock("../hooks/useApplicationInfo", () => {
  return {
    useApplicationName: () => {
      return {
        applicationName: mockedApplicationName,
      }
    },
  }
})

describe("Home", () => {
  it("allows the user to get more information on Exposure Detection status", () => {
    const navigateSpy = jest.fn()
    ;(useNavigation as jest.Mock).mockReturnValue({
      navigate: navigateSpy,
    })

    const { getByTestId } = render(<Home />)

    fireEvent.press(getByTestId("exposure-scanning-status-button"))
    expect(navigateSpy).toHaveBeenCalledWith(
      HomeStackScreens.ExposureDetectionStatus,
    )
  })

  it("allows users to share the application", () => {
    const configuration = factories.configurationContext.build()

    const shareSpy = jest.spyOn(Share, "share")

    const { getByLabelText } = render(
      <ConfigurationContext.Provider value={configuration}>
        <Home />
      </ConfigurationContext.Provider>,
    )

    fireEvent.press(getByLabelText(`Share ${mockedApplicationName}`))

    expect(shareSpy).toHaveBeenCalledWith({
      message: `Check out this app ${mockedApplicationName}, which can help us contain COVID-19! ${configuration.appDownloadLink}`,
    })
  })

  describe("When the exposure notification permissions are enabled, the app is authorized, Bluetooth is on, and Location is on", () => {
    it("renders an on message", () => {
      const enPermissionStatus = ENPermissionStatus.ENABLED
      const permissionProviderValue = createPermissionProviderValue(
        enPermissionStatus,
      )

      const { getByText } = render(
        <PermissionsContext.Provider value={permissionProviderValue}>
          <SystemServicesContext.Provider
            value={{
              isBluetoothOn: true,
              locationPermissions: "RequiredOn",
            }}
          >
            <Home />
          </SystemServicesContext.Provider>
        </PermissionsContext.Provider>,
      )

      expect(getByText("Exposure Detection On")).toBeDefined()
    })
  })

  describe("When bluetooth is off", () => {
    it("renders an off message", () => {
      const enPermissionStatus = ENPermissionStatus.ENABLED
      const permissionProviderValue = createPermissionProviderValue(
        enPermissionStatus,
      )

      const { getByText } = render(
        <PermissionsContext.Provider value={permissionProviderValue}>
          <SystemServicesContext.Provider
            value={{
              isBluetoothOn: false,
              locationPermissions: "RequiredOn",
            }}
          >
            <Home />
          </SystemServicesContext.Provider>
        </PermissionsContext.Provider>,
      )

      expect(getByText("Exposure Detection Off")).toBeDefined()
    })
  })

  describe("When location is off", () => {
    describe("and location is required", () => {
      it("renders an off message", () => {
        const enPermissionStatus = ENPermissionStatus.ENABLED
        const permissionProviderValue = createPermissionProviderValue(
          enPermissionStatus,
        )

        const { getByText } = render(
          <PermissionsContext.Provider value={permissionProviderValue}>
            <SystemServicesContext.Provider
              value={{
                isBluetoothOn: true,
                locationPermissions: "RequiredOff",
              }}
            >
              <Home />
            </SystemServicesContext.Provider>
          </PermissionsContext.Provider>,
        )

        expect(getByText("Exposure Detection Off")).toBeDefined()
      })
    })

    describe("and location is not required", () => {
      it("renders an on message", () => {
        const enPermissionStatus = ENPermissionStatus.ENABLED
        const permissionProviderValue = createPermissionProviderValue(
          enPermissionStatus,
        )

        const { getByText } = render(
          <PermissionsContext.Provider value={permissionProviderValue}>
            <SystemServicesContext.Provider
              value={{
                isBluetoothOn: true,
                locationPermissions: "NotRequired",
              }}
            >
              <Home />
            </SystemServicesContext.Provider>
          </PermissionsContext.Provider>,
        )

        expect(getByText("Exposure Detection On")).toBeDefined()
      })
    })
  })

  describe("When exposure notifications are disabled", () => {
    it("renders an off message", () => {
      const enPermissionStatus = ENPermissionStatus.DISABLED
      const permissionProviderValue = createPermissionProviderValue(
        enPermissionStatus,
      )

      const { getByText } = render(
        <PermissionsContext.Provider value={permissionProviderValue}>
          <SystemServicesContext.Provider
            value={{
              isBluetoothOn: true,
              locationPermissions: "RequiredOn",
            }}
          >
            <Home />
          </SystemServicesContext.Provider>
        </PermissionsContext.Provider>,
      )

      expect(getByText("Exposure Detection Off")).toBeDefined()
    })
  })

  describe("When exposure notifications are not authorized", () => {
    it("renders an off message", () => {
      const enPermissionStatus = ENPermissionStatus.NOT_AUTHORIZED
      const permissionProviderValue = createPermissionProviderValue(
        enPermissionStatus,
      )

      const { getByText } = render(
        <PermissionsContext.Provider value={permissionProviderValue}>
          <SystemServicesContext.Provider
            value={{
              isBluetoothOn: true,
              locationPermissions: "RequiredOn",
            }}
          >
            <Home />
          </SystemServicesContext.Provider>
        </PermissionsContext.Provider>,
      )

      expect(getByText("Exposure Detection Off")).toBeDefined()
    })
  })
})

const createPermissionProviderValue = (
  enPermissionStatus: ENPermissionStatus,
  requestPermission: () => Promise<void> = () => Promise.resolve(),
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
      request: requestPermission,
    },
  }
}
