import React from "react"
import { Alert, Share } from "react-native"
import {
  waitFor,
  render,
  fireEvent,
  within,
} from "@testing-library/react-native"
import { useNavigation } from "@react-navigation/native"
import "@testing-library/jest-native/extend-expect"

import Home from "."
import { PermissionsContext, ENPermissionStatus } from "../PermissionsContext"
import { PermissionStatus } from "../permissionStatus"
import { SystemServicesContext } from "../SystemServicesContext"
import { ConfigurationContext } from "../ConfigurationContext"
import { factories } from "../factories"

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
  beforeEach(() => {
    jest.resetAllMocks()
  })

  it("allows users to share the application", () => {
    const configuration = factories.configurationContext.build()
    const permissionProviderValue = createPermissionProviderValue(
      ENPermissionStatus.ENABLED,
    )

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

  describe("When the exposure notification permissions are enabled, the app is authorized, Bluetooth is on, and Location is on", () => {
    it("renders an active message", () => {
      const enPermissionStatus = ENPermissionStatus.ENABLED
      const permissionProviderValue = createPermissionProviderValue(
        enPermissionStatus,
      )

      const { getByTestId } = render(
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

      const header = getByTestId("home-header")
      const subheader = getByTestId("home-subheader")
      const bluetoothStatusContainer = getByTestId(
        "home-bluetooth-status-container",
      )
      const proximityTracingStatusContainer = getByTestId(
        "home-proximity-tracing-status-container",
      )
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

  describe("When Bluetooth is off", () => {
    it("renders an inactive message and a disabled message for bluetooth", () => {
      const enPermissionStatus = ENPermissionStatus.ENABLED
      const permissionProviderValue = createPermissionProviderValue(
        enPermissionStatus,
      )

      const { getByTestId } = render(
        <PermissionsContext.Provider value={permissionProviderValue}>
          <SystemServicesContext.Provider
            value={{
              isBluetoothOn: false,
              locationPermissions: "NotRequired",
            }}
          >
            <Home />
          </SystemServicesContext.Provider>
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

    it("prompts the user to enable Bluetooth", () => {
      const enPermissionStatus = ENPermissionStatus.ENABLED
      const permissionProviderValue = createPermissionProviderValue(
        enPermissionStatus,
      )

      const { getByTestId } = render(
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

      const fixBluetoothButton = getByTestId("home-bluetooth-status-container")
      const alertSpy = jest.spyOn(Alert, "alert")

      fireEvent.press(fixBluetoothButton)
      expect(alertSpy).toHaveBeenCalledWith(
        "Enable Bluetooth in Settings",
        "Go to the Settings app and enable Bluetooth to fix this error",
        [
          expect.objectContaining({ text: "Back" }),
          expect.objectContaining({ text: "Open Settings" }),
        ],
      )
    })
  })

  describe("When Bluetooth is enabled", () => {
    it("allows the user to get more information", () => {
      const navigationSpy = jest.fn()
      ;(useNavigation as jest.Mock).mockReturnValue({ navigate: navigationSpy })

      const enPermissionStatus = ENPermissionStatus.ENABLED
      const permissionProviderValue = createPermissionProviderValue(
        enPermissionStatus,
      )

      const { getByTestId } = render(
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

      const bluetoothInfoButton = getByTestId("home-bluetooth-status-container")

      fireEvent.press(bluetoothInfoButton)
      expect(navigationSpy).toHaveBeenCalledWith("BluetoothInfo")
    })
  })

  describe("When the app is not authorized", () => {
    describe("When the platform is iOS", () => {
      it("renders an inactive message and a disabled message for proximity tracing", () => {
        const enPermissionStatus = ENPermissionStatus.NOT_AUTHORIZED
        const permissionProviderValue = createPermissionProviderValue(
          enPermissionStatus,
        )

        const { getByTestId } = render(
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

        const header = getByTestId("home-header")
        const subheader = getByTestId("home-subheader")
        const proximityTracingStatusContainer = getByTestId(
          "home-proximity-tracing-status-container",
        )
        const proximityTracingDisabledText = within(
          proximityTracingStatusContainer,
        ).getByText("Disabled")

        expect(header).toHaveTextContent("Inactive")
        expect(subheader).toHaveTextContent(
          "Enable Bluetooth and Proximity Tracing to get info about possible exposures",
        )
        expect(proximityTracingDisabledText).toBeDefined()
      })

      it("requests exposure notifications and shows a not authorized alert", async () => {
        const enPermissionStatus = ENPermissionStatus.NOT_AUTHORIZED
        const requestSpy = jest.fn()
        const permissionProviderValue = createPermissionProviderValue(
          enPermissionStatus,
          requestSpy,
        )

        const { getByTestId } = render(
          <PermissionsContext.Provider value={permissionProviderValue}>
            <Home />
          </PermissionsContext.Provider>,
        )

        const alertSpy = jest.spyOn(Alert, "alert")
        const fixProximityTracingButton = getByTestId(
          "home-proximity-tracing-status-container",
        )

        const expectedMessage =
          "To enable Proximity Tracing and Exposure Notifications, please go to the Exposure Notificaiton section in Settings and Share Exposure Information and set the Active Region to applicationName"

        fireEvent.press(fixProximityTracingButton)
        expect(requestSpy).toHaveBeenCalled()
        await waitFor(() => {
          expect(alertSpy).toHaveBeenCalledWith(
            "Enable Proximity Tracing",
            expectedMessage,
            [
              expect.objectContaining({ text: "Back" }),
              expect.objectContaining({ text: "Open Settings" }),
            ],
          )
        })
      })
    })
  })

  describe("When the app is not enabled", () => {
    it("requests exposure notification permissions", () => {
      const enPermissionStatus = ENPermissionStatus.DISABLED
      const requestSpy = jest.fn()
      const permissionProviderValue = createPermissionProviderValue(
        enPermissionStatus,
        requestSpy,
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
      expect(requestSpy).toHaveBeenCalled()
    })
  })

  describe("When exposure notification permissions are authorized and the app is enabled", () => {
    it("allows the user to get more information", () => {
      const navigationSpy = jest.fn()
      ;(useNavigation as jest.Mock).mockReturnValue({
        navigate: navigationSpy,
      })

      const enPermissionStatus = ENPermissionStatus.ENABLED
      const permissionProviderValue = createPermissionProviderValue(
        enPermissionStatus,
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
      expect(navigationSpy).toHaveBeenCalledWith("ProximityTracingInfo")
    })
  })

  describe("When the device does not support locationless scanning", () => {
    describe("and location is on", () => {
      it("location is shown as enabled", () => {
        const { getByTestId } = render(
          <SystemServicesContext.Provider
            value={{
              isBluetoothOn: true,
              locationPermissions: "RequiredOn",
            }}
          >
            <Home />
          </SystemServicesContext.Provider>,
        )

        const locationStatusContainer = getByTestId(
          "home-location-status-container",
        )
        const enabledText = within(locationStatusContainer).getByText("Enabled")

        expect(enabledText).toBeDefined()
      })
    })

    describe("and the location is off", () => {
      it("location is shown as disabled", () => {
        const { getByTestId } = render(
          <SystemServicesContext.Provider
            value={{
              isBluetoothOn: true,
              locationPermissions: "RequiredOff",
            }}
          >
            <Home />
          </SystemServicesContext.Provider>,
        )

        const locationStatusContainer = getByTestId(
          "home-location-status-container",
        )

        const disabledText = within(locationStatusContainer).getByText(
          "Disabled",
        )
        expect(disabledText).toBeDefined()
      })
    })
  })

  describe("When the device supports locationless scanning", () => {
    it("location is not shown", () => {
      const { queryByTestId } = render(
        <SystemServicesContext.Provider
          value={{
            isBluetoothOn: true,
            locationPermissions: "NotRequired",
          }}
        >
          <Home />
        </SystemServicesContext.Provider>,
      )

      const locationStatusContainer = queryByTestId(
        "home-location-status-container",
      )

      expect(locationStatusContainer).toBeNull()
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
