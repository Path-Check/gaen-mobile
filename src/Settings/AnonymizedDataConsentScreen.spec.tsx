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
      ;(useNavigation as jest.Mock).mockReturnValue({ navigate: navigationSpy })

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
      expect(navigationSpy).toHaveBeenCalledWith(Stacks.Settings)
      expect(updateUserConsent).not.toHaveBeenCalled()
    })
  })

  describe("when a user clicks to consent", () => {
    it("updates their consent status and navigates back to settings", async () => {
      expect.assertions(2)
      const navigationSpy = jest.fn()
      ;(useNavigation as jest.Mock).mockReturnValue({ navigate: navigationSpy })

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
