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
import { PermissionsContext } from "../../Device/PermissionsContext"
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

let mockedRequestAuthorizationResponse: RequestAuthorizationResponse = {
  kind: "success",
  status: "Active",
}
jest.mock("../../gaen/nativeModule", () => {
  return {
    requestAuthorization: async () => {
      return mockedRequestAuthorizationResponse
    },
  }
})

describe("ExposureDetectionStatusScreen", () => {
  beforeEach(() => {
    jest.resetAllMocks()
  })

  describe("When the app is not authorized", () => {
    it("shows a disabled message for Exposure Notifications and a general disabled message", () => {
      mockedRequestAuthorizationResponse = {
        kind: "success",
        status: "Unauthorized",
      }

      const { getByTestId, getByText } = render(
        <ExposureDetectionStatusScreen />,
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
      mockedRequestAuthorizationResponse = {
        kind: "success",
        status: "Unauthorized",
      }

      const { getByTestId } = render(<ExposureDetectionStatusScreen />)

      const alertSpy = jest.spyOn(Alert, "alert")

      const expectedMessage =
        "Open the Settings app, then navigate to the Exposure Notifications settings for this app. Ensure 'Share Exposure Information' is turned on, then press 'Set As Active Region'."

      fireEvent.press(getByTestId("exposure-notifications-status-container"))
      await waitFor(() => {
        expect(alertSpy).toHaveBeenCalledWith(
          "Share Exposure Information",
          expectedMessage,
          [
            expect.objectContaining({ text: "Back" }),
            expect.objectContaining({ text: "Open Settings" }),
          ],
        )
      })
    })
  })

  describe("When exposure notification permissions are authorized and the app is enabled", () => {
    it("allows the user to get more info about Exposure Notifications", async () => {
      const navigateSpy = jest.fn()
      ;(useNavigation as jest.Mock).mockReturnValue({
        navigate: navigateSpy,
      })

      const permissionsState = factories.permissionsContext.build({
        exposureNotifications: {
          status: "Active",
        },
      })

      const { getByTestId } = render(
        <PermissionsContext.Provider value={permissionsState}>
          <ExposureDetectionStatusScreen />
        </PermissionsContext.Provider>,
      )

      fireEvent.press(getByTestId("exposure-notifications-status-container"))
      await waitFor(() => {
        expect(navigateSpy).toHaveBeenCalledWith(
          HomeStackScreens.ExposureNotificationsInfo,
        )
      })
    })
  })

  describe("When the device needs location to be on", () => {
    describe("and location is on", () => {
      it("shows location as enabled", () => {
        const permissionsState = factories.permissionsContext.build({
          exposureNotifications: { status: "Active" },
          locationRequirement: "Required",
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
          exposureNotifications: {
            status: "Active",
          },
          locationRequirement: "Required",
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
          exposureNotifications: { status: "LocationOffAndRequired" },
          locationRequirement: "Required",
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

  describe("When the device does not require location to be on", () => {
    it("does not show the location status", () => {
      const permissionsState = factories.permissionsContext.build({
        locationRequirement: "NotRequired",
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
