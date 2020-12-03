jest.mock("../../logger.ts")
import React from "react"
import { render, fireEvent } from "@testing-library/react-native"

import { AffectedUserContext } from "../AffectedUserContext"
import { OnboardingContext } from "../../OnboardingContext"
import { ExposureContext } from "../../ExposureContext"
import PublishConsentScreen from "./PublishConsentScreen"
import { factories } from "../../factories"

jest.mock("@react-navigation/native")

describe("PublishConsentScreen", () => {
  describe("when the context contains hmacKey and certificate", () => {
    it("renders the PublishConsentForm", () => {
      const { queryByText, getByTestId } = render(
        <OnboardingContext.Provider
          value={{
            isOnboardingComplete: true,
            completeOnboarding: async () => {},
            resetOnboarding: () => {},
          }}
        >
          <ExposureContext.Provider value={factories.exposureContext.build()}>
            <AffectedUserContext.Provider
              value={{
                hmacKey: "hmacKey",
                certificate: "certificate",
                setExposureSubmissionCredentials: jest.fn(),
                setExposureKeys: jest.fn(),
                exposureKeys: [],
                navigateOutOfStack: () => {},
              }}
            >
              <PublishConsentScreen />
            </AffectedUserContext.Provider>
          </ExposureContext.Provider>
        </OnboardingContext.Provider>,
      )

      expect(queryByText("Invalid State")).toBeNull()
      expect(getByTestId("publish-consent-form")).toBeDefined()
    })
  })

  describe("when the context is missing hmacKey and certificate", () => {
    it("displays warning and prompts user to go back to home screen", async () => {
      const navigateOutOfStackSpy = jest.fn()
      const { getByText } = render(
        <OnboardingContext.Provider
          value={{
            isOnboardingComplete: true,
            completeOnboarding: async () => {},
            resetOnboarding: () => {},
          }}
        >
          <AffectedUserContext.Provider
            value={{
              hmacKey: null,
              certificate: null,
              setExposureSubmissionCredentials: jest.fn(),
              setExposureKeys: jest.fn(),
              exposureKeys: [],
              navigateOutOfStack: navigateOutOfStackSpy,
            }}
          >
            <PublishConsentScreen />
          </AffectedUserContext.Provider>
        </OnboardingContext.Provider>,
      )

      expect(getByText("Invalid State")).toBeDefined()
      fireEvent.press(getByText("Go Back"))

      expect(navigateOutOfStackSpy).toHaveBeenCalled()
    })
  })
})
