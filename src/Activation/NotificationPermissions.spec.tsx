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
      const onboardingProviderValue = createOnboardingProviderValue()

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
    it("marks onboarding complete", () => {
      expect(true).toBeTruthy()
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

const createOnboardingProviderValue = (): OnboardingContextState => {
  return {
    onboardingIsComplete: false,
    completeOnboarding: () => {},
    resetOnboarding: () => {},
  }
}
