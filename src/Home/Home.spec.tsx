import React from "react"
import { Alert } from "react-native"
import {
  render,
  waitFor,
  fireEvent,
  within,
} from "@testing-library/react-native"
import { useNavigation } from "@react-navigation/native"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import "@testing-library/jest-native/extend-expect"

import Home from "./Home"
import { PermissionsContext, ENPermissionStatus } from "../PermissionsContext"
import { PermissionStatus } from "../permissionStatus"
import { isBluetoothEnabled } from "../gaen/nativeModule"
import { isPlatformiOS } from "../utils/index"

jest.mock("@react-navigation/native")
;(useNavigation as jest.Mock).mockReturnValue({ navigate: jest.fn() })

jest.mock("react-native-safe-area-context")
;(useSafeAreaInsets as jest.Mock).mockReturnValue({ insets: { bottom: 0 } })

jest.mock("../gaen/nativeModule")
jest.mock("../utils/index")
const mockedApplicationName = "applicationName"
jest.mock("../More/useApplicationInfo", () => {
  return {
    useApplicationInfo: () => {
      return {
        applicationName: mockedApplicationName,
        versionInfo: "versionInfo",
      }
    },
  }
})

describe("Home", () => {
  describe("When the enPermissionStatus is enabled and authorized and Bluetooth is on", () => {
    it("renders an active message", async () => {
      const isBluetoothOn = "true"
      ;(isBluetoothEnabled as jest.Mock).mockResolvedValueOnce(isBluetoothOn)

      const enPermissionStatus: ENPermissionStatus = ["AUTHORIZED", "ENABLED"]
      const permissionProviderValue = createPermissionProviderValue(
        enPermissionStatus,
      )

      const { getByTestId } = render(
        <PermissionsContext.Provider value={permissionProviderValue}>
          <Home />
        </PermissionsContext.Provider>,
      )

      const header = getByTestId("home-header")
      const subheader = getByTestId("home-subheader")
      const bluetoothStatusContainer = getByTestId(
        "home-bluetooth-status-container",
      )
      const proximityTracingStatusContainer = getByTestId(
        "home-proximity-tracing-status-container",
      )

      await waitFor(() => {
        const bluetoothEnabledText = within(bluetoothStatusContainer).getByText(
          "Enabled",
        )
        const proximityTracingEnabledText = within(
          proximityTracingStatusContainer,
        ).getByText("Enabled")

        expect(header).toHaveTextContent("Active")
        expect(subheader).toHaveTextContent(
          `${mockedApplicationName} will remain active after the app has been closed`,
        )
        expect(bluetoothEnabledText).toBeDefined()
        expect(proximityTracingEnabledText).toBeDefined()
      })
    })
  })

  describe("When the enPermissionStatus is not enabled and not authorized", () => {
    it("renders an inactive message and a disabled message for proximity tracing", async () => {
      const isBluetoothOn = "true"
      ;(isBluetoothEnabled as jest.Mock).mockResolvedValueOnce(isBluetoothOn)

      const enPermissionStatus: ENPermissionStatus = [
        "UNAUTHORIZED",
        "DISABLED",
      ]
      const permissionProviderValue = createPermissionProviderValue(
        enPermissionStatus,
      )

      const { getByTestId } = render(
        <PermissionsContext.Provider value={permissionProviderValue}>
          <Home />
        </PermissionsContext.Provider>,
      )

      const header = getByTestId("home-header")
      const subheader = getByTestId("home-subheader")
      const proximityTracingStatusContainer = getByTestId(
        "home-proximity-tracing-status-container",
      )
      const proximityTracingDisabledText = within(
        proximityTracingStatusContainer,
      ).getByText("Disabled")
      await waitFor(() => {
        expect(header).toHaveTextContent("Inactive")
        expect(subheader).toHaveTextContent(
          "Enable Bluetooth and Proximity Tracing to get info about possible exposures",
        )
        expect(proximityTracingDisabledText).toBeDefined()
      })
    })
  })

  describe("When Bluetooth is off", () => {
    it("renders an inactive message and a disabled message for bluetooth", () => {
      const isBluetoothOn = "false"
      ;(isBluetoothEnabled as jest.Mock).mockResolvedValueOnce(isBluetoothOn)

      const enPermissionStatus: ENPermissionStatus = ["AUTHORIZED", "ENABLED"]
      const permissionProviderValue = createPermissionProviderValue(
        enPermissionStatus,
      )

      const { getByTestId } = render(
        <PermissionsContext.Provider value={permissionProviderValue}>
          <Home />
        </PermissionsContext.Provider>,
      )

      const header = getByTestId("home-header")
      const subheader = getByTestId("home-subheader")
      const bluetoothStatusContainer = getByTestId(
        "home-bluetooth-status-container",
      )
      const bluetoothDisabledText = within(bluetoothStatusContainer).getByText(
        "Disabled",
      )

      expect(header).toHaveTextContent("Inactive")
      expect(subheader).toHaveTextContent(
        "Enable Bluetooth and Proximity Tracing to get info about possible exposures",
      )
      expect(bluetoothDisabledText).toBeDefined()
    })
  })

  describe("When Bluetooth is disabled", () => {
    it("it prompts the user to enable Bluetooth", async () => {
      expect.assertions(1)
      const isBluetoothOn = "false"
      ;(isBluetoothEnabled as jest.Mock).mockResolvedValueOnce(isBluetoothOn)

      const enPermissionStatus: ENPermissionStatus = ["AUTHORIZED", "ENABLED"]
      const permissionProviderValue = createPermissionProviderValue(
        enPermissionStatus,
      )

      const { getByTestId } = render(
        <PermissionsContext.Provider value={permissionProviderValue}>
          <Home />
        </PermissionsContext.Provider>,
      )

      const fixBluetoothButton = getByTestId("home-bluetooth-status-container")
      const alert = jest.spyOn(Alert, "alert")

      fireEvent.press(fixBluetoothButton)
      await waitFor(() => {
        expect(alert).toHaveBeenCalledWith(
          "Enable Bluetooth in Settings",
          "Enable Bluetooth in the Settings app",
          [{ text: "Okay" }],
        )
      })
    })
  })

  describe("When proximity tracing is disabled", () => {
    describe("when enPermissionStatus is authorized but not enabled", () => {
      it("requests exposure notification to be enabled", async () => {
        expect.assertions(1)

        const enPermissionStatus: ENPermissionStatus = [
          "AUTHORIZED",
          "DISABLED",
        ]
        const requestPermission = jest.fn()
        const permissionProviderValue = createPermissionProviderValue(
          enPermissionStatus,
          requestPermission,
        )

        const { getByTestId } = render(
          <PermissionsContext.Provider value={permissionProviderValue}>
            <Home />
          </PermissionsContext.Provider>,
        )

        const fixProximityTracingButton = getByTestId(
          "home-proximity-tracing-status-container",
        )

        fireEvent.press(fixProximityTracingButton)
        await waitFor(() => {
          expect(requestPermission).toHaveBeenCalled()
        })
      })
    })

    describe("when enPermissionStatus is unauthorized", () => {
      describe("when the platform is iOS", () => {
        it("shows an unauthorized alert", async () => {
          expect.assertions(1)
          ;(isPlatformiOS as jest.Mock).mockReturnValueOnce(true)

          const enPermissionStatus: ENPermissionStatus = [
            "UNAUTHORIZED",
            "DISABLED",
          ]
          const permissionProviderValue = createPermissionProviderValue(
            enPermissionStatus,
          )

          const { getByTestId } = render(
            <PermissionsContext.Provider value={permissionProviderValue}>
              <Home />
            </PermissionsContext.Provider>,
          )

          const fixProximityTracingButton = getByTestId(
            "home-proximity-tracing-status-container",
          )
          const alert = jest.spyOn(Alert, "alert")

          fireEvent.press(fixProximityTracingButton)
          await waitFor(() => {
            expect(alert).toHaveBeenCalledWith(
              "Authorize in Settings",
              "To activate Proximity Tracing, authorize COVID-19 Exposure Logging in the Settings app",
              [expect.objectContaining({ text: "Open Settings" })],
            )
          })
        })
      })
    })
  })
})

const createPermissionProviderValue = (
  enPermissionStatus: ENPermissionStatus,
  requestPermission: () => void = () => {},
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
