import {
  determineActivationSteps,
  Environment,
} from "./useActivationNavigation"

describe("useActivationNavigation", () => {
  describe("when location is required and off, bluetooth is off, display accept terms of service is true, and product analytics are turned on", () => {
    it("returns the correct set of activation steps", () => {
      const environment: Environment = {
        locationPermissions: "RequiredOff",
        isBluetoothOn: false,
        displayAcceptTermsOfService: true,
        enableProductAnalytics: true,
      }

      const activationSteps = determineActivationSteps(environment)

      const expectedActivationSteps = [
        "AcceptTermsOfService",
        "AnonymizedDataConsent",
        "ActivateLocation",
        "ActivateBluetooth",
        "ActivateExposureNotifications",
        "NotificationPermissions",
        "ActivationSummary",
      ]

      expect(activationSteps).toEqual(expectedActivationSteps)
    })
  })
  describe("when location is not required, bluetooth is on, display accept terms of service is false, and product analytics are turned off", () => {
    it("returns the correct set of activation steps", () => {
      const environment: Environment = {
        locationPermissions: "NotRequired",
        isBluetoothOn: true,
        displayAcceptTermsOfService: false,
        enableProductAnalytics: false,
      }

      const activationSteps = determineActivationSteps(environment)

      const expectedActivationSteps = [
        "ActivateExposureNotifications",
        "NotificationPermissions",
        "ActivationSummary",
      ]

      expect(activationSteps).toEqual(expectedActivationSteps)
    })
  })
})
