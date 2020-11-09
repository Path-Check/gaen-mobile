import React from "react"
import { render, fireEvent, waitFor } from "@testing-library/react-native"
import { useNavigation } from "@react-navigation/native"

import ProductAnalyticsConsentForm from "./ProductAnalyticsConsentForm"
import { factories } from "../factories"
import { ProductAnalyticsContext } from "../ProductAnalytics/Context"
import { ActivationStackScreens } from "../navigation"

jest.mock("@react-navigation/native")

describe("ProductAnalyticsConsentForm", () => {
  describe("When the user presses accept consent", () => {
    it("updates their consent status and navigates to the activation summary", async () => {
      const navigationSpy = jest.fn()
      ;(useNavigation as jest.Mock).mockReturnValueOnce({
        navigate: navigationSpy,
        setOptions: jest.fn(),
      })

      const updateUserConsent = jest.fn()
      const context = factories.productAnalyticsContext.build({
        userConsentedToAnalytics: false,
        updateUserConsent,
      })

      const { getByLabelText } = render(
        <ProductAnalyticsContext.Provider value={context}>
          <ProductAnalyticsConsentForm />
        </ProductAnalyticsContext.Provider>,
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

  describe("when the user presses maybe later", () => {
    it("does not update their consent status and navigates to the activation summary", async () => {
      const navigationSpy = jest.fn()
      ;(useNavigation as jest.Mock).mockReturnValueOnce({
        navigate: navigationSpy,
        setOptions: jest.fn(),
      })

      const updateUserConsent = jest.fn()
      const context = factories.productAnalyticsContext.build({
        userConsentedToAnalytics: false,
        updateUserConsent,
      })

      const { getByLabelText } = render(
        <ProductAnalyticsContext.Provider value={context}>
          <ProductAnalyticsConsentForm />
        </ProductAnalyticsContext.Provider>,
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
