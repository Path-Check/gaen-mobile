import React from "react"
import { render, fireEvent, waitFor } from "@testing-library/react-native"
import { useNavigation } from "@react-navigation/native"

import AnonymizedDataConsentScreen from "./AnonymizedDataConsentScreen"
import { factories } from "../factories"
import { AnalyticsContext } from "../AnalyticsContext"
import { Stacks } from "../navigation"

jest.mock("@react-navigation/native")
describe("AnonymizedDataConsentScreen", () => {
  describe("when a user clicks the close button", () => {
    it("navigates back to settings without changing their consent", () => {
      const navigationSpy = jest.fn()
      ;(useNavigation as jest.Mock).mockReturnValue({ goBack: navigationSpy })

      const updateUserConsent = jest.fn()
      const context = factories.analyticsContext.build({
        userConsentedToAnalytics: false,
        updateUserConsent,
      })
      const { getByTestId } = render(
        <AnalyticsContext.Provider value={context}>
          <AnonymizedDataConsentScreen />
        </AnalyticsContext.Provider>,
      )

      const closeButton = getByTestId("close-consent-screen")
      fireEvent.press(closeButton)

      expect(navigationSpy).toHaveBeenCalled()
      expect(updateUserConsent).not.toHaveBeenCalled()
    })
  })

  describe("when a user has consented to data sharing", () => {
    it("displays the correct status", () => {
      const context = factories.analyticsContext.build({
        userConsentedToAnalytics: true,
      })
      const { queryByText } = render(
        <AnalyticsContext.Provider value={context}>
          <AnonymizedDataConsentScreen />
        </AnalyticsContext.Provider>,
      )

      const headerText = queryByText("You are sharing anonymized data")
      const buttonText = queryByText("Stop Sharing Data")

      expect(headerText).not.toBeNull()
      expect(buttonText).not.toBeNull()
    })

    describe("and they press to revoke consent", () => {
      it("updates their consent status and navigates to settings", async () => {
        expect.assertions(2)
        const navigationSpy = jest.fn()
        ;(useNavigation as jest.Mock).mockReturnValue({
          navigate: navigationSpy,
        })

        const updateUserConsent = jest.fn()
        const context = factories.analyticsContext.build({
          userConsentedToAnalytics: true,
          updateUserConsent,
        })
        const { getByText } = render(
          <AnalyticsContext.Provider value={context}>
            <AnonymizedDataConsentScreen />
          </AnalyticsContext.Provider>,
        )

        const consentButton = getByText("Stop Sharing Data")
        fireEvent.press(consentButton)

        await waitFor(() => {
          expect(updateUserConsent).toHaveBeenCalledWith(false)
          expect(navigationSpy).toHaveBeenCalledWith(Stacks.Settings)
        })
      })
    })
  })

  describe("when a user has not consented to data sharing", () => {
    it("displays the correct status", () => {
      const context = factories.analyticsContext.build({
        userConsentedToAnalytics: false,
      })
      const { queryByText } = render(
        <AnalyticsContext.Provider value={context}>
          <AnonymizedDataConsentScreen />
        </AnalyticsContext.Provider>,
      )

      const headerText = queryByText("Share Anonymized Data")
      const buttonText = queryByText("I Understand and Consent")

      expect(headerText).not.toBeNull()
      expect(buttonText).not.toBeNull()
    })

    describe("and they press to accept consent", () => {
      it("updates their consent status and navigates back to settings", async () => {
        expect.assertions(2)
        const navigationSpy = jest.fn()
        ;(useNavigation as jest.Mock).mockReturnValue({
          navigate: navigationSpy,
        })

        const updateUserConsent = jest.fn()
        const context = factories.analyticsContext.build({
          userConsentedToAnalytics: false,
          updateUserConsent,
        })
        const { getByText } = render(
          <AnalyticsContext.Provider value={context}>
            <AnonymizedDataConsentScreen />
          </AnalyticsContext.Provider>,
        )

        const consentButton = getByText("I Understand and Consent")
        fireEvent.press(consentButton)

        await waitFor(() => {
          expect(updateUserConsent).toHaveBeenCalledWith(true)
          expect(navigationSpy).toHaveBeenCalledWith(Stacks.Settings)
        })
      })
    })
  })
})
