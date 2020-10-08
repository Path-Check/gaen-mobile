import React from "react"
import { Alert } from "react-native"
import {
  waitFor,
  render,
  fireEvent,
  within,
} from "@testing-library/react-native"
import { useNavigation } from "@react-navigation/native"
import "@testing-library/jest-native/extend-expect"

import ExposureDetectionStatus from "./ExposureDetectionStatus"
import { HomeStackScreens } from "../navigation"
import { PermissionsContext, ENPermissionStatus } from "../PermissionsContext"
import { PermissionStatus } from "../permissionStatus"
import { SystemServicesContext } from "../SystemServicesContext"

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

describe("ExposureDetectionStatus", () => {
  beforeEach(() => {
    jest.resetAllMocks()
  })

  describe("When Bluetooth is off", () => {
    it("shows a disabled message for Bluetooth and a general disabled message", () => {
      const enPermissionStatus = ENPermissionStatus.ENABLED
      const permissionProviderValue = createPermissionProviderValue(
        enPermissionStatus,
      )

      const { getByTestId, getByText } = render(
        <PermissionsContext.Provider value={permissionProviderValue}>
          <SystemServicesContext.Provider
            value={{
              isBluetoothOn: false,
              locationPermissions: "NotRequired",
            }}
          >
            <ExposureDetectionStatus />
          </SystemServicesContext.Provider>
        </PermissionsContext.Provider>,
      )

      const bluetoothStatusContainer = getByTestId("bluetooth-status-container")

      const bluetoothDisabledText = within(bluetoothStatusContainer).getByText(
        "OFF",
      )

      expect(bluetoothDisabledText).toBeDefined()
      expect(
        getByText(
          "Your device is not scanning for exposures. Fix the issues below to enable Exposure Detection.",
        ),
      ).toBeDefined()
    })

    it("allows the user to get info on enabling Bluetooth", () => {
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
            <ExposureDetectionStatus />
          </SystemServicesContext.Provider>
        </PermissionsContext.Provider>,
      )

      const alertSpy = jest.spyOn(Alert, "alert")

      fireEvent.press(getByTestId("bluetooth-status-container"))
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
    it("allows the user to get more info about Bluetooth", () => {
      const navigateSpy = jest.fn()
      ;(useNavigation as jest.Mock).mockReturnValue({ navigate: navigateSpy })

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
            <ExposureDetectionStatus />
          </SystemServicesContext.Provider>
        </PermissionsContext.Provider>,
      )

      fireEvent.press(getByTestId("bluetooth-status-container"))
      expect(navigateSpy).toHaveBeenCalledWith(HomeStackScreens.BluetoothInfo)
    })
  })

  describe("When the app is not authorized", () => {
    it("shows a disabled message for Exposure Notifications and a general disabled message", () => {
      const enPermissionStatus = ENPermissionStatus.NOT_AUTHORIZED
      const permissionProviderValue = createPermissionProviderValue(
        enPermissionStatus,
      )

      const { getByTestId, getByText } = render(
        <PermissionsContext.Provider value={permissionProviderValue}>
          <SystemServicesContext.Provider
            value={{
              isBluetoothOn: true,
              locationPermissions: "NotRequired",
            }}
          >
            <ExposureDetectionStatus />
          </SystemServicesContext.Provider>
        </PermissionsContext.Provider>,
      )

      const exposureNotificationsStatusContainer = getByTestId(
        "exposure-notifications-status-container",
      )
      const exposureNotificationsDisabledText = within(
        exposureNotificationsStatusContainer,
      ).getByText("OFF")

      expect(
        getByText(
          "Your device is not scanning for exposures. Fix the issues below to enable Exposure Detection.",
        ),
      ).toBeDefined()
      expect(exposureNotificationsDisabledText).toBeDefined()
    })

    it("allows the user to get info on how to fix exposure notifications and shows a not authorized alert", async () => {
      const enPermissionStatus = ENPermissionStatus.NOT_AUTHORIZED
      const requestSpy = jest.fn()
      const permissionProviderValue = createPermissionProviderValue(
        enPermissionStatus,
        requestSpy,
      )

      const { getByTestId } = render(
        <PermissionsContext.Provider value={permissionProviderValue}>
          <ExposureDetectionStatus />
        </PermissionsContext.Provider>,
      )

      const alertSpy = jest.spyOn(Alert, "alert")

      const expectedMessage =
        "To enable Exposure Notifications, go to the Exposure Notification section in Settings and Share Exposure Information and set the Active Region to applicationName"

      fireEvent.press(getByTestId("exposure-notifications-status-container"))
      expect(requestSpy).toHaveBeenCalled()
      await waitFor(() => {
        expect(alertSpy).toHaveBeenCalledWith(
          "Enable Exposure Notifications",
          expectedMessage,
          [
            expect.objectContaining({ text: "Back" }),
            expect.objectContaining({ text: "Open Settings" }),
          ],
        )
      })
    })
  })

  describe("When the app is not enabled", () => {
    it("allows the user to request exposure notification permissions", () => {
      const enPermissionStatus = ENPermissionStatus.DISABLED
      const requestSpy = jest.fn()
      const permissionProviderValue = createPermissionProviderValue(
        enPermissionStatus,
        requestSpy,
      )

      const { getByTestId } = render(
        <PermissionsContext.Provider value={permissionProviderValue}>
          <ExposureDetectionStatus />
        </PermissionsContext.Provider>,
      )

      fireEvent.press(getByTestId("exposure-notifications-status-container"))
      expect(requestSpy).toHaveBeenCalled()
    })
  })

  describe("When exposure notification permissions are authorized and the app is enabled", () => {
    it("allows the user to get more info about Exposure Notifications", () => {
      const navigateSpy = jest.fn()
      ;(useNavigation as jest.Mock).mockReturnValue({
        navigate: navigateSpy,
      })

      const enPermissionStatus = ENPermissionStatus.ENABLED
      const permissionProviderValue = createPermissionProviderValue(
        enPermissionStatus,
      )

      const { getByTestId } = render(
        <PermissionsContext.Provider value={permissionProviderValue}>
          <ExposureDetectionStatus />
        </PermissionsContext.Provider>,
      )

      fireEvent.press(getByTestId("exposure-notifications-status-container"))
      expect(navigateSpy).toHaveBeenCalledWith(
        HomeStackScreens.ExposureNotificationsInfo,
      )
    })
  })

  describe("When the device does not support locationless scanning", () => {
    describe("and location is on", () => {
      it("shows location as enabled", () => {
        const { getByTestId } = render(
          <SystemServicesContext.Provider
            value={{
              isBluetoothOn: true,
              locationPermissions: "RequiredOn",
            }}
          >
            <ExposureDetectionStatus />
          </SystemServicesContext.Provider>,
        )

        const locationStatusContainer = getByTestId("location-status-container")
        const enabledText = within(locationStatusContainer).getByText("ON")
        expect(enabledText).toBeDefined()
      })

      it("allows the user to get more info about location services", () => {
        const navigateSpy = jest.fn()
        ;(useNavigation as jest.Mock).mockReturnValue({ navigate: navigateSpy })

        const { getByTestId } = render(
          <SystemServicesContext.Provider
            value={{
              isBluetoothOn: true,
              locationPermissions: "RequiredOn",
            }}
          >
            <ExposureDetectionStatus />
          </SystemServicesContext.Provider>,
        )

        fireEvent.press(getByTestId("location-status-container"))
        expect(navigateSpy).toHaveBeenCalledWith(HomeStackScreens.LocationInfo)
      })
    })

    describe("and location is off", () => {
      it("shows a disabled message for location and a general disabled message", () => {
        const { getByTestId, getByText } = render(
          <SystemServicesContext.Provider
            value={{
              isBluetoothOn: true,
              locationPermissions: "RequiredOff",
            }}
          >
            <ExposureDetectionStatus />
          </SystemServicesContext.Provider>,
        )

        const locationStatusContainer = getByTestId("location-status-container")
        const disabledText = within(locationStatusContainer).getByText("OFF")
        expect(disabledText).toBeDefined()
        expect(
          getByText(
            "Your device is not scanning for exposures. Fix the issues below to enable Exposure Detection.",
          ),
        ).toBeDefined()
      })
    })
  })

  describe("When the device supports locationless scanning", () => {
    it("does not show the location status", () => {
      const { queryByTestId } = render(
        <SystemServicesContext.Provider
          value={{
            isBluetoothOn: true,
            locationPermissions: "NotRequired",
          }}
        >
          <ExposureDetectionStatus />
        </SystemServicesContext.Provider>,
      )

      const locationStatusContainer = queryByTestId("location-status-container")
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
