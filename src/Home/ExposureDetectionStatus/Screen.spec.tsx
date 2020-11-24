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

import { HomeStackScreens } from "../../navigation"
import {
  PermissionsContext,
  ENPermissionStatus,
} from "../../Device/PermissionsContext"
import { LocationPermissions } from "../../Device/useLocationPermissions"
import { factories } from "../../factories"
import { RequestAuthorizationResponse } from "../../gaen/nativeModule"
import ExposureDetectionStatusScreen from "./Screen"

jest.mock("@react-navigation/native")

const mockedApplicationName = "applicationName"
jest.mock("../../Device/useApplicationInfo", () => {
  return {
    useApplicationName: () => {
      return {
        applicationName: mockedApplicationName,
      }
    },
  }
})

describe("ExposureDetectionStatusScreen", () => {
  beforeEach(() => {
    jest.resetAllMocks()
  })

  describe("When the app is not authorized", () => {
    it("shows a disabled message for Exposure Notifications and a general disabled message", () => {
      const enPermissionStatus = "Unauthorized"
      const locationPermissions = "NotRequired"
      const permissionProviderValue = createPermissionProviderValue(
        locationPermissions,
        enPermissionStatus,
      )

      const { getByTestId, getByText } = render(
        <PermissionsContext.Provider value={permissionProviderValue}>
          <ExposureDetectionStatusScreen />
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
      const enPermissionStatus = "Unauthorized"
      const requestSpy = jest.fn()
      const permissionProviderValue = createPermissionProviderValue(
        "RequiredOn",
        enPermissionStatus,
        requestSpy,
      )

      const { getByTestId } = render(
        <PermissionsContext.Provider value={permissionProviderValue}>
          <ExposureDetectionStatusScreen />
        </PermissionsContext.Provider>,
      )

      const alertSpy = jest.spyOn(Alert, "alert")

      const expectedMessage =
        "Open Settings, then navigate to the Exposure Notifications settings for this app. Ensure Share Exposure Information is turned on, then press 'Set As Active Region'."

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
      const enPermissionStatus = "Disabled"
      const requestSpy = jest.fn()
      const permissionProviderValue = createPermissionProviderValue(
        "RequiredOn",
        enPermissionStatus,
        requestSpy,
      )

      const { getByTestId } = render(
        <PermissionsContext.Provider value={permissionProviderValue}>
          <ExposureDetectionStatusScreen />
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

      const enPermissionStatus = "Active"
      const permissionProviderValue = createPermissionProviderValue(
        "RequiredOn",
        enPermissionStatus,
      )

      const { getByTestId } = render(
        <PermissionsContext.Provider value={permissionProviderValue}>
          <ExposureDetectionStatusScreen />
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
        const permissionsState = factories.permissionsContext.build({
          locationPermissions: "RequiredOn",
        })

        const { getByTestId } = render(
          <PermissionsContext.Provider value={permissionsState}>
            <ExposureDetectionStatusScreen />
          </PermissionsContext.Provider>,
        )

        const locationStatusContainer = getByTestId("location-status-container")
        const enabledText = within(locationStatusContainer).getByText("ON")
        expect(enabledText).toBeDefined()
      })

      it("allows the user to get more info about location services", () => {
        const navigateSpy = jest.fn()
        ;(useNavigation as jest.Mock).mockReturnValue({ navigate: navigateSpy })
        const permissionsState = factories.permissionsContext.build({
          locationPermissions: "RequiredOn",
        })

        const { getByTestId } = render(
          <PermissionsContext.Provider value={permissionsState}>
            <ExposureDetectionStatusScreen />
          </PermissionsContext.Provider>,
        )

        fireEvent.press(getByTestId("location-status-container"))
        expect(navigateSpy).toHaveBeenCalledWith(HomeStackScreens.LocationInfo)
      })
    })

    describe("and location is off", () => {
      it("shows a disabled message for location and a general disabled message", () => {
        const permissionsState = factories.permissionsContext.build({
          locationPermissions: "RequiredOff",
        })
        const { getByTestId, getByText } = render(
          <PermissionsContext.Provider value={permissionsState}>
            <ExposureDetectionStatusScreen />
          </PermissionsContext.Provider>,
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
      const permissionsState = factories.permissionsContext.build({
        locationPermissions: "NotRequired",
      })

      const { queryByTestId } = render(
        <PermissionsContext.Provider value={permissionsState}>
          <ExposureDetectionStatusScreen />
        </PermissionsContext.Provider>,
      )

      const locationStatusContainer = queryByTestId("location-status-container")
      expect(locationStatusContainer).toBeNull()
    })
  })
})

const createPermissionProviderValue = (
  locationPermissions: LocationPermissions = "RequiredOn",
  enPermissionStatus: ENPermissionStatus,
  requestPermission: () => Promise<RequestAuthorizationResponse> = () =>
    Promise.resolve({ kind: "failure" as const, error: "Unknown" as const }),
) => {
  return {
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
