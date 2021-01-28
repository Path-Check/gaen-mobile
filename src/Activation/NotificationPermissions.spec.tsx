import React from "react"
import { render, fireEvent, waitFor } from "@testing-library/react-native"
import { useNavigation } from "@react-navigation/native"

import { PermissionsContext } from "../Device/PermissionsContext"
import { ActivationStackScreens } from "../navigation"
import NotificationPermissions from "./NotificationPermissions"
import { OnboardingProvider } from "../OnboardingContext"
import { factories } from "../factories"

jest.mock("@react-navigation/native")

describe("NotificationPermissions", () => {
  describe("when a user enables notifications,", () => {
    it("requests permissions", () => {
      const notificationRequestSpy = jest.fn()
      const permissionsProviderValue = factories.permissionsContext.build({
        notification: { request: notificationRequestSpy },
      })

      const { getByLabelText } = render(
        <OnboardingProvider userHasCompletedOnboarding>
          <PermissionsContext.Provider value={permissionsProviderValue}>
            <NotificationPermissions />
          </PermissionsContext.Provider>
        </OnboardingProvider>,
      )

      fireEvent.press(getByLabelText("Enable Notifications"))

      expect(notificationRequestSpy).toHaveBeenCalled()
    })
    it("navigates to the next screen", async () => {
      expect.assertions(1)
      const navigationSpy = jest.fn()
      ;(useNavigation as jest.Mock).mockReturnValue({
        navigate: navigationSpy,
      })

      const { getByLabelText } = render(
        <OnboardingProvider userHasCompletedOnboarding>
          <NotificationPermissions />
        </OnboardingProvider>,
      )

      fireEvent.press(getByLabelText("Enable Notifications"))

      await waitFor(() => {
        expect(navigationSpy).toHaveBeenCalledWith(
          ActivationStackScreens.ActivationSummary,
        )
      })
    })
  })
  describe("when a user does not enable notifications", () => {
    it("does not request permissions", () => {
      const notificationRequestSpy = jest.fn()
      const permissionsProviderValue = factories.permissionsContext.build({
        notification: { request: notificationRequestSpy },
      })

      const { getByText } = render(
        <OnboardingProvider userHasCompletedOnboarding>
          <PermissionsContext.Provider value={permissionsProviderValue}>
            <NotificationPermissions />
          </PermissionsContext.Provider>
        </OnboardingProvider>,
      )

      fireEvent.press(getByText("Maybe later"))

      expect(notificationRequestSpy).not.toHaveBeenCalled()
    })
    it("navigates to the next screen", () => {
      const navigationSpy = jest.fn()
      ;(useNavigation as jest.Mock).mockReturnValue({ navigate: navigationSpy })

      const { getByText } = render(
        <OnboardingProvider userHasCompletedOnboarding>
          <NotificationPermissions />
        </OnboardingProvider>,
      )

      fireEvent.press(getByText("Maybe later"))

      expect(navigationSpy).toHaveBeenCalledWith(
        ActivationStackScreens.ActivationSummary,
      )
    })
  })
})
