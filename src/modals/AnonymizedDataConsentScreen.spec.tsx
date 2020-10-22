import React from "react"
import { render, fireEvent, waitFor } from "@testing-library/react-native"
import { useNavigation } from "@react-navigation/native"

import AnonymizedDataConsentScreen from "./AnonymizedDataConsentScreen"
import { factories } from "../factories"
import { AnalyticsContext } from "../AnalyticsContext"
import { OnboardingContext } from "../OnboardingContext"
import { ActivationStackScreens } from "../navigation"

jest.mock("@react-navigation/native")

describe("AnonymizedDataConsentScreen", () => {
  describe("when the user has completed onboarding", () => {
    describe("and has consented to data sharing", () => {
      it("displays the correct status", () => {
        const context = factories.analyticsContext.build({
          userConsentedToAnalytics: true,
        })
        ;(useNavigation as jest.Mock).mockReturnValue({
          setOptions: jest.fn(),
        })
        const { getByText } = render(
          <OnboardingContext.Provider
            value={createOnboardingProviderValue(true)}
          >
            <AnalyticsContext.Provider value={context}>
              <AnonymizedDataConsentScreen />
            </AnalyticsContext.Provider>
          </OnboardingContext.Provider>,
        )

        const buttonText = getByText("Stop Sharing Data")

        expect(buttonText).toBeDefined()
      })

      describe("and they press to revoke consent", () => {
        it("updates their consent status and navigates back", async () => {
          expect.assertions(2)
          const navigationSpy = jest.fn()
          ;(useNavigation as jest.Mock).mockReturnValue({
            goBack: navigationSpy,
            setOptions: jest.fn(),
          })

          const updateUserConsent = jest.fn()
          const context = factories.analyticsContext.build({
            userConsentedToAnalytics: true,
            updateUserConsent,
          })
          const { getByLabelText } = render(
            <OnboardingContext.Provider
              value={createOnboardingProviderValue(true)}
            >
              <AnalyticsContext.Provider value={context}>
                <AnonymizedDataConsentScreen />
              </AnalyticsContext.Provider>
            </OnboardingContext.Provider>,
          )

          const consentButton = getByLabelText("Stop Sharing Data")
          fireEvent.press(consentButton)

          await waitFor(() => {
            expect(updateUserConsent).toHaveBeenCalledWith(false)
            expect(navigationSpy).toHaveBeenCalled()
          })
        })
      })
    })

    describe("and has not consented to data sharing", () => {
      it("displays the correct button text", () => {
        const context = factories.analyticsContext.build({
          userConsentedToAnalytics: false,
        })
        ;(useNavigation as jest.Mock).mockReturnValue({
          setOptions: jest.fn(),
        })
        const { getByText } = render(
          <OnboardingContext.Provider
            value={createOnboardingProviderValue(true)}
          >
            <AnalyticsContext.Provider value={context}>
              <AnonymizedDataConsentScreen />
            </AnalyticsContext.Provider>
          </OnboardingContext.Provider>,
        )

        const buttonText = getByText("I Understand and Consent")

        expect(buttonText).toBeDefined()
      })

      describe("and they press to accept consent", () => {
        it("updates their consent status and navigates back", async () => {
          const navigationSpy = jest.fn()
          ;(useNavigation as jest.Mock).mockReturnValueOnce({
            goBack: navigationSpy,
            setOptions: jest.fn(),
          })

          const updateUserConsent = jest.fn()
          const context = factories.analyticsContext.build({
            userConsentedToAnalytics: false,
            updateUserConsent,
          })
          const { getByLabelText } = render(
            <OnboardingContext.Provider
              value={createOnboardingProviderValue(true)}
            >
              <AnalyticsContext.Provider value={context}>
                <AnonymizedDataConsentScreen />
              </AnalyticsContext.Provider>
            </OnboardingContext.Provider>,
          )

          const consentButton = getByLabelText("I Understand and Consent")
          fireEvent.press(consentButton)

          await waitFor(() => {
            expect(updateUserConsent).toHaveBeenCalledWith(true)
            expect(navigationSpy).toHaveBeenCalled()
          })
        })
      })
    })
  })
  describe("when the user is in the onboarding flow", () => {
    describe("and they press to accept consent", () => {
      it("updates their consent status and navigates to the activation summary", async () => {
        const navigationSpy = jest.fn()
        ;(useNavigation as jest.Mock).mockReturnValueOnce({
          navigate: navigationSpy,
          setOptions: jest.fn(),
        })

        const updateUserConsent = jest.fn()
        const context = factories.analyticsContext.build({
          userConsentedToAnalytics: false,
          updateUserConsent,
        })

        const { getByLabelText } = render(
          <OnboardingContext.Provider
            value={createOnboardingProviderValue(false)}
          >
            <AnalyticsContext.Provider value={context}>
              <AnonymizedDataConsentScreen />
            </AnalyticsContext.Provider>
          </OnboardingContext.Provider>,
        )

        const consentButton = getByLabelText("I Understand and Consent")
        fireEvent.press(consentButton)

        await waitFor(() => {
          expect(updateUserConsent).toHaveBeenCalledWith(true)
          expect(navigationSpy).toHaveBeenCalledWith(
            ActivationStackScreens.ActivationSummary,
          )
        })
      })
    })
    describe("and they press maybe later", () => {
      it("does not update their consent status and navigates to the activation summary", async () => {
        const navigationSpy = jest.fn()
        ;(useNavigation as jest.Mock).mockReturnValueOnce({
          navigate: navigationSpy,
          setOptions: jest.fn(),
        })

        const updateUserConsent = jest.fn()
        const context = factories.analyticsContext.build({
          userConsentedToAnalytics: false,
          updateUserConsent,
        })

        const { getByLabelText } = render(
          <OnboardingContext.Provider
            value={createOnboardingProviderValue(false)}
          >
            <AnalyticsContext.Provider value={context}>
              <AnonymizedDataConsentScreen />
            </AnalyticsContext.Provider>
          </OnboardingContext.Provider>,
        )

        const maybeLaterButton = getByLabelText("Maybe later")
        fireEvent.press(maybeLaterButton)

        await waitFor(() => {
          expect(updateUserConsent).not.toHaveBeenCalled()
          expect(navigationSpy).toHaveBeenCalledWith(
            ActivationStackScreens.ActivationSummary,
          )
        })
      })
    })
  })
})

const createOnboardingProviderValue = (isOnboardingComplete: boolean) => {
  return {
    isOnboardingComplete: isOnboardingComplete,
    completeOnboarding: () => {},
    resetOnboarding: () => {},
  }
}
