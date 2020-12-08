import {
  determineActivationSteps,
  Environment,
} from "./useActivationNavigation"

describe("determineActivationSteps", () => {
  describe("when location is required and off", () => {
    it("the activate location step is included", () => {
      const environment: Environment = {
        exposureNotificationsStatus: "LocationOffAndRequired",
        displayAcceptTermsOfService: true,
        enableProductAnalytics: true,
      }

      const activationSteps = determineActivationSteps(environment)

      expect(activationSteps).toContain("ActivateLocation")
    })
  })
  describe("when display accept terms of service is true", () => {
    it("the accept terms of service step is included", () => {
      const environment: Environment = {
        exposureNotificationsStatus: "Active",
        displayAcceptTermsOfService: true,
        enableProductAnalytics: true,
      }

      const activationSteps = determineActivationSteps(environment)

      expect(activationSteps).toContain("AcceptTermsOfService")
    })
  })
  describe("when product analytics are on", () => {
    it("the product analytics consent step is included", () => {
      const environment: Environment = {
        exposureNotificationsStatus: "Active",
        displayAcceptTermsOfService: true,
        enableProductAnalytics: true,
      }

      const activationSteps = determineActivationSteps(environment)

      expect(activationSteps).toContain("ProductAnalyticsConsent")
    })
  })
})
