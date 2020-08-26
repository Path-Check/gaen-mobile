import React from "react"
import { Alert, Share } from "react-native"
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
import {
  PermissionsContext,
  ENAuthorizationEnablementStatus,
} from "../PermissionsContext"
import { PermissionStatus } from "../permissionStatus"
import { isPlatformiOS } from "../utils/index"
import { useBluetoothStatus } from "./useBluetoothStatus"
import { factories } from "../factories"
import { ConfigurationContext } from "../ConfigurationContext"

jest.mock("@react-navigation/native")

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
jest.mock("./useBluetoothStatus.ts")

describe("Home", () => {
  it("allows users to share the application", () => {
    const configuration = factories.configurationContext.build()
    const permissionProviderValue = createPermissionProviderValue({
      authorized: true,
      enabled: true,
    })

    const shareSpy = jest.spyOn(Share, "share")

    const { getByLabelText } = render(
      <ConfigurationContext.Provider value={configuration}>
        <PermissionsContext.Provider value={permissionProviderValue}>
          <Home />
        </PermissionsContext.Provider>
      </ConfigurationContext.Provider>,
    )

    fireEvent.press(
      getByLabelText("Share the app and help protect yourself and others."),
    )

    expect(shareSpy).toHaveBeenCalledWith({
      message: `Check out this app ${mockedApplicationName}, which can help us contain COVID-19! ${configuration.appDownloadLink}`,
    })
  })

  describe("When the exposure notification permissions are enabled and the app is authorized and Bluetooth is on", () => {
    it("renders an active message", async () => {
      const isBluetoothOn = true
      ;(useBluetoothStatus as jest.Mock).mockReturnValue(isBluetoothOn)

      const isENAuthorizedAndEnabled: ENAuthorizationEnablementStatus = {
        authorized: true,
        enabled: true,
      }
      const permissionProviderValue = createPermissionProviderValue(
        isENAuthorizedAndEnabled,
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

  describe("When the exposure notification permissions are not enabled and the app is not authorized", () => {
    it("renders an inactive message and a disabled message for proximity tracing", async () => {
      const isBluetoothOn = true
      ;(useBluetoothStatus as jest.Mock).mockReturnValue(isBluetoothOn)

      const isENAuthorizedAndEnabled: ENAuthorizationEnablementStatus = {
        authorized: false,
        enabled: false,
      }
      const permissionProviderValue = createPermissionProviderValue(
        isENAuthorizedAndEnabled,
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
    it("renders an inactive message and a disabled message for bluetooth", async () => {
      const isBluetoothOn = false
      ;(useBluetoothStatus as jest.Mock).mockReturnValue(isBluetoothOn)

      const isENAuthorizedAndEnabled: ENAuthorizationEnablementStatus = {
        authorized: true,
        enabled: true,
      }
      const permissionProviderValue = createPermissionProviderValue(
        isENAuthorizedAndEnabled,
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
      const isBluetoothOn = false
      ;(useBluetoothStatus as jest.Mock).mockReturnValue(isBluetoothOn)

      const isENAuthorizedAndEnabled: ENAuthorizationEnablementStatus = {
        authorized: true,
        enabled: true,
      }
      const permissionProviderValue = createPermissionProviderValue(
        isENAuthorizedAndEnabled,
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

  describe("When Bluetooth is enabled", () => {
    it("allows the user to get more information", async () => {
      expect.assertions(1)
      const isBluetoothOn = true
      ;(useBluetoothStatus as jest.Mock).mockReturnValue(isBluetoothOn)

      const navigationSpy = jest.fn()
      ;(useNavigation as jest.Mock).mockReturnValue({ navigate: navigationSpy })

      const isENAuthorizedAndEnabled: ENAuthorizationEnablementStatus = {
        authorized: true,
        enabled: true,
      }
      const permissionProviderValue = createPermissionProviderValue(
        isENAuthorizedAndEnabled,
      )

      const { getByTestId } = render(
        <PermissionsContext.Provider value={permissionProviderValue}>
          <Home />
        </PermissionsContext.Provider>,
      )

      const bluetoothInfoButton = getByTestId("home-bluetooth-status-container")

      fireEvent.press(bluetoothInfoButton)
      await waitFor(() => {
        expect(navigationSpy).toHaveBeenCalledWith("BluetoothInfo")
      })
    })
  })

  describe("When proximity tracing is disabled", () => {
    describe("when exposure notification permissions are authorized but not enabled", () => {
      it("shows an enable proximity tracing alert", async () => {
        expect.assertions(1)

        const isENAuthorizedAndEnabled: ENAuthorizationEnablementStatus = {
          authorized: true,
          enabled: false,
        }
        const permissionProviderValue = createPermissionProviderValue(
          isENAuthorizedAndEnabled,
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
          expect(
            alert,
          ).toHaveBeenCalledWith(
            `Enable Proximity Tracing from "${mockedApplicationName}"?`,
            `Your mobile device can securely collect and share random IDs with nearby devices. ${mockedApplicationName} app can use these IDs to notify you if you’ve been exposed to COVID-19. The date, duration, and signal strength of an exposure will be shared with ${mockedApplicationName}.`,
            [
              expect.objectContaining({ text: "Cancel" }),
              expect.objectContaining({ text: "Enable" }),
            ],
          )
        })
      })
    })

    describe("When proximity tracing is enabled", () => {
      it("allows the user to get more information", async () => {
        expect.assertions(1)

        const navigationSpy = jest.fn()
        ;(useNavigation as jest.Mock).mockReturnValue({
          navigate: navigationSpy,
        })

        const isENAuthorizedAndEnabled: ENAuthorizationEnablementStatus = {
          authorized: true,
          enabled: true,
        }
        const permissionProviderValue = createPermissionProviderValue(
          isENAuthorizedAndEnabled,
        )

        const { getByTestId } = render(
          <PermissionsContext.Provider value={permissionProviderValue}>
            <Home />
          </PermissionsContext.Provider>,
        )

        const proximityTracingInfoButton = getByTestId(
          "home-proximity-tracing-status-container",
        )

        fireEvent.press(proximityTracingInfoButton)
        await waitFor(() => {
          expect(navigationSpy).toHaveBeenCalledWith("ProximityTracingInfo")
        })
      })
    })

    describe("when exposure notification permissions are unauthorized", () => {
      describe("when the platform is iOS", () => {
        it("shows an unauthorized alert", async () => {
          expect.assertions(1)
          ;(isPlatformiOS as jest.Mock).mockReturnValueOnce(true)

          const isENAuthorizedAndEnabled: ENAuthorizationEnablementStatus = {
            authorized: false,
            enabled: false,
          }
          const permissionProviderValue = createPermissionProviderValue(
            isENAuthorizedAndEnabled,
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
              [
                expect.objectContaining({ text: "Back" }),
                expect.objectContaining({ text: "Open Settings" }),
              ],
            )
          })
        })
      })
    })
  })
})

const createPermissionProviderValue = (
  isENAuthorizedAndEnabled: ENAuthorizationEnablementStatus,
  requestPermission: () => void = () => {},
) => {
  return {
    notification: {
      status: PermissionStatus.UNKNOWN,
      check: () => {},
      request: () => {},
    },
    exposureNotifications: {
      status: isENAuthorizedAndEnabled,
      check: () => {},
      request: requestPermission,
    },
  }
}
