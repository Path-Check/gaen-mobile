import React from "react"
import { Share } from "react-native"
import { render, fireEvent } from "@testing-library/react-native"
import { useNavigation } from "@react-navigation/native"
import "@testing-library/jest-native/extend-expect"

import Home from "./index"
import { HomeStackScreens } from "../navigation"
import { factories } from "../factories"
import { ConfigurationContext } from "../ConfigurationContext"
import {
  PermissionsContext,
  ENPermissionStatus,
} from "../Device/PermissionsContext"
import { LocationPermissions } from "../Device/useLocationPermissions"
import { RequestAuthorizationResponse } from "src/gaen/nativeModule"

jest.mock("@react-navigation/native")

const mockedApplicationName = "applicationName"
jest.mock("../Device/useApplicationInfo", () => {
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

  describe("When the exposure notification permissions are active, the app is authorized, Bluetooth is on, and Location is on", () => {
    it("renders an on message", () => {
      const enPermissionStatus = "Active"
      const isBluetoothOn = true
      const locationPermissions = "RequiredOn"
      const permissionProviderValue = createPermissionProviderValue(
        enPermissionStatus,
        isBluetoothOn,
        locationPermissions,
      )

      const { getByText } = render(
        <PermissionsContext.Provider value={permissionProviderValue}>
          <Home />
        </PermissionsContext.Provider>,
      )

      expect(getByText("Exposure Detection On")).toBeDefined()
    })
  })

  describe("When location is off", () => {
    describe("and location is required", () => {
      it("renders an off message", () => {
        const enPermissionStatus = "Active"
        const isBluetoothOn = true
        const locationPermissions = "RequiredOff"
        const permissionProviderValue = createPermissionProviderValue(
          enPermissionStatus,
          isBluetoothOn,
          locationPermissions,
        )

        const { getByText } = render(
          <PermissionsContext.Provider value={permissionProviderValue}>
            <Home />
          </PermissionsContext.Provider>,
        )

        expect(getByText("Exposure Detection Off")).toBeDefined()
      })
    })

    describe("and location is not required", () => {
      it("renders an on message", () => {
        const enPermissionStatus = "Active"
        const isBluetoothOn = true
        const locationPermissions = "NotRequired"
        const permissionProviderValue = createPermissionProviderValue(
          enPermissionStatus,
          isBluetoothOn,
          locationPermissions,
        )

        const { getByText } = render(
          <PermissionsContext.Provider value={permissionProviderValue}>
            <Home />
          </PermissionsContext.Provider>,
        )

        expect(getByText("Exposure Detection On")).toBeDefined()
      })
    })
  })

  describe("When exposure notifications are disabled", () => {
    it("renders an off message", () => {
      const enPermissionStatus = "Disabled"
      const isBluetoothOn = true
      const locationPermissions = "RequiredOn"
      const permissionProviderValue = createPermissionProviderValue(
        enPermissionStatus,
        isBluetoothOn,
        locationPermissions,
      )

      const { getByText } = render(
        <PermissionsContext.Provider value={permissionProviderValue}>
          <Home />
        </PermissionsContext.Provider>,
      )

      expect(getByText("Exposure Detection Off")).toBeDefined()
    })
  })

  describe("When exposure notifications are unauthorized", () => {
    it("renders an off message", () => {
      const enPermissionStatus = "Unauthorized"
      const isBluetoothOn = true
      const locationPermissions = "RequiredOn"
      const permissionProviderValue = createPermissionProviderValue(
        enPermissionStatus,
        isBluetoothOn,
        locationPermissions,
      )

      const { getByText } = render(
        <PermissionsContext.Provider value={permissionProviderValue}>
          <Home />
        </PermissionsContext.Provider>,
      )

      expect(getByText("Exposure Detection Off")).toBeDefined()
    })
  })
})

const createPermissionProviderValue = (
  enPermissionStatus: ENPermissionStatus,
  isBluetoothOn: boolean,
  locationPermissions: LocationPermissions,
) => {
  const requestPermission: () => Promise<RequestAuthorizationResponse> = () =>
    Promise.resolve({ kind: "failure" as const, error: "Unknown" as const })
  return {
    isBluetoothOn,
    locationPermissions,
    notification: {
      status: "Unknown" as const,
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
