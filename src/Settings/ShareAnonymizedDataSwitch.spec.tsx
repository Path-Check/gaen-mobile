import React from "react"
import { render, fireEvent } from "@testing-library/react-native"
import { useNavigation } from "@react-navigation/native"

import { AnalyticsContext } from "../AnalyticsContext"
import ShareAnonymizedDataSwitch from "./ShareAnonymizedDataSwitch"
import { factories } from "../factories"
import { SettingsScreens } from "../navigation"

jest.mock("@react-navigation/native")
describe("toggling anonymized data consent", () => {
  describe("when the user has consented to analytics", () => {
    it("turns user consent off", () => {
      const updateUserConsent = jest.fn()
      const context = factories.analyticsContext.build({
        userConsentedToAnalytics: true,
        updateUserConsent,
      })

      const { getByTestId } = render(
        <AnalyticsContext.Provider value={context}>
          <ShareAnonymizedDataSwitch />
        </AnalyticsContext.Provider>,
      )

      const shareDataSwitch = getByTestId("share-anonymized-data-switch")

      fireEvent(shareDataSwitch, "onValueChange", false)
      expect(updateUserConsent).toHaveBeenCalledWith(false)
    })
  })

  describe("when the user has not consented to analytics", () => {
    it("navigates them to the consent screen", () => {
      const navigationSpy = jest.fn()
      ;(useNavigation as jest.Mock).mockReturnValue({ navigate: navigationSpy })
      const context = factories.analyticsContext.build({
        userConsentedToAnalytics: false,
      })

      const { getByTestId } = render(
        <AnalyticsContext.Provider value={context}>
          <ShareAnonymizedDataSwitch />
        </AnalyticsContext.Provider>,
      )

      const shareDataSwitch = getByTestId("share-anonymized-data-switch")

      fireEvent(shareDataSwitch, "onValueChange", true)
      expect(navigationSpy).toHaveBeenCalledWith(
        SettingsScreens.AnonymizedDataConsent,
      )
    })
  })
})
