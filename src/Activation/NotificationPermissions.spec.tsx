import React from "react"
import { render, fireEvent, waitFor } from "@testing-library/react-native"
import NotificationPermissions from "./NotificationPermissions"

import {
  PermissionsContext,
  PermissionsContextState,
} from "../PermissionsContext"
import { OnboardingContext, OnboardingContextState } from "../OnboardingContext"
import { PermissionStatus } from "../permissionStatus"

describe("NotificationPermissions", () => {
  describe("when a user enables notifications,", () => {
    it("requests permissions", () => {
      const onboardingProviderValue = createOnboardingProviderValue(jest.fn())

      const notificationRequestSpy = jest.fn()
      const permissionsProviderValue = createPermissionProviderValue(
        notificationRequestSpy,
      )

      const { getByLabelText } = render(
        <OnboardingContext.Provider value={onboardingProviderValue}>
          <PermissionsContext.Provider value={permissionsProviderValue}>
            <NotificationPermissions />
          </PermissionsContext.Provider>
        </OnboardingContext.Provider>,
      )

      fireEvent.press(getByLabelText("Enable Notifications"))

      expect(notificationRequestSpy).toHaveBeenCalled()
    })
    it("marks onboarding complete", async () => {
      const completeOnboardingSpy = jest.fn()
      const onboardingProviderValue = createOnboardingProviderValue(
        completeOnboardingSpy,
      )

      const notificationRequestSpy = jest.fn()
      const permissionsProviderValue = createPermissionProviderValue(
        notificationRequestSpy,
      )

      const { getByLabelText } = render(
        <OnboardingContext.Provider value={onboardingProviderValue}>
          <PermissionsContext.Provider value={permissionsProviderValue}>
            <NotificationPermissions />
          </PermissionsContext.Provider>
        </OnboardingContext.Provider>,
      )

      fireEvent.press(getByLabelText("Enable Notifications"))

      await waitFor(() => {
        expect(completeOnboardingSpy).toHaveBeenCalled()
      })
    })
  })
  describe("when a user does not enable notifications", () => {
    it("does not request permissions", () => {
      const onboardingProviderValue = createOnboardingProviderValue(jest.fn())

      const notificationRequestSpy = jest.fn()
      const permissionsProviderValue = createPermissionProviderValue(
        notificationRequestSpy,
      )

      const { getByText } = render(
        <OnboardingContext.Provider value={onboardingProviderValue}>
          <PermissionsContext.Provider value={permissionsProviderValue}>
            <NotificationPermissions />
          </PermissionsContext.Provider>
        </OnboardingContext.Provider>,
      )

      fireEvent.press(getByText("Maybe later"))

      expect(notificationRequestSpy).not.toHaveBeenCalled()
    })
    it("marks onboarding complete", async () => {
      const completeOnboardingSpy = jest.fn()
      const onboardingProviderValue = createOnboardingProviderValue(
        completeOnboardingSpy,
      )

      const notificationRequestSpy = jest.fn()
      const permissionsProviderValue = createPermissionProviderValue(
        notificationRequestSpy,
      )

      const { getByText } = render(
        <OnboardingContext.Provider value={onboardingProviderValue}>
          <PermissionsContext.Provider value={permissionsProviderValue}>
            <NotificationPermissions />
          </PermissionsContext.Provider>
        </OnboardingContext.Provider>,
      )

      fireEvent.press(getByText("Maybe later"))

      await waitFor(() => {
        expect(completeOnboardingSpy).toHaveBeenCalled()
      })
    })
  })
})

const createPermissionProviderValue = (
  requestPermission: () => void = () => {},
): PermissionsContextState => {
  return {
    notification: {
      status: PermissionStatus.UNKNOWN,
      check: () => {},
      request: requestPermission,
    },
    exposureNotifications: {
      status: { authorized: true, enabled: true },
      check: () => {},
      request: () => {},
    },
  }
}

const createOnboardingProviderValue = (
  completeOnboarding: () => void = () => {},
): OnboardingContextState => {
  return {
    onboardingIsComplete: false,
    completeOnboarding,
    resetOnboarding: () => {},
  }
}
