import {
  determineOnboardingSteps,
  Environment,
} from "./useOnboardingNavigation"

describe("determineOnboardingSteps", () => {
  describe("when displayAppTransition is true", () => {
    it("the displayAppTransition step is included", () => {
      const environment: Environment = {
        displayAppTransition: true,
        displayAgeVerification: false,
      }

      const activationSteps = determineOnboardingSteps(environment)

      expect(activationSteps).toContain("AppTransition")
    })
  })
  describe("when displayAgeVerification is true", () => {
    it("the displayAgeVerification step is included", () => {
      const environment: Environment = {
        displayAppTransition: false,
        displayAgeVerification: true,
      }

      const activationSteps = determineOnboardingSteps(environment)

      expect(activationSteps).toContain("AgeVerification")
    })
  })
})
