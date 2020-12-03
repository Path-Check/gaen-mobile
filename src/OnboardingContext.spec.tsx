import React, { FunctionComponent, useEffect } from "react"
import { render, waitFor } from "@testing-library/react-native"

import { OnboardingProvider, useOnboardingContext } from "./OnboardingContext"
import { StorageUtils } from "./utils"
import { Text } from "react-native"

describe("OnboardingContext", () => {
  describe("getting the current onboarding completion status", () => {
    it("passes down the correct onboarding status to its children", async () => {
      expect.assertions(1)

      const { getByText } = render(
        <OnboardingProvider userHasCompletedOnboarding>
          <OnboardingStatus />
        </OnboardingProvider>,
      )

      expect(getByText(/onboarding complete/)).toHaveTextContent("true")
    })
  })

  describe("completing onboarding", () => {
    it("sets onboarding complete in storage and context", async () => {
      expect.assertions(2)
      const storageSpy = jest.spyOn(StorageUtils, "setIsOnboardingComplete")
      const { getByText } = render(
        <OnboardingProvider userHasCompletedOnboarding={false}>
          <CompleteOnboarding />
        </OnboardingProvider>,
      )

      await waitFor(() => {
        expect(storageSpy).toHaveBeenCalled()
        expect(getByText(/onboarding complete/)).toHaveTextContent("true")
      })
    })
  })

  describe("resetting onboarding", () => {
    it("sets onboarding to incomplete in storage and context", () => {
      expect.assertions(2)
      const storageSpy = jest.spyOn(StorageUtils, "removeIsOnboardingComplete")
      const { getByText } = render(
        <OnboardingProvider userHasCompletedOnboarding>
          <ResetOnboarding />
        </OnboardingProvider>,
      )

      expect(storageSpy).toHaveBeenCalled()
      expect(getByText(/onboarding complete/)).toHaveTextContent("false")
    })
  })
})

const OnboardingStatus: FunctionComponent = () => {
  const { isOnboardingComplete } = useOnboardingContext()

  return <Text>onboarding complete: {isOnboardingComplete.toString()}</Text>
}

const CompleteOnboarding: FunctionComponent = () => {
  const { isOnboardingComplete, completeOnboarding } = useOnboardingContext()

  useEffect(() => {
    completeOnboarding()
  }, [completeOnboarding])

  return <Text>onboarding complete: {isOnboardingComplete.toString()}</Text>
}

const ResetOnboarding: FunctionComponent = () => {
  const { isOnboardingComplete, resetOnboarding } = useOnboardingContext()

  useEffect(() => {
    resetOnboarding()
  }, [resetOnboarding])

  return <Text>onboarding complete: {isOnboardingComplete.toString()}</Text>
}
