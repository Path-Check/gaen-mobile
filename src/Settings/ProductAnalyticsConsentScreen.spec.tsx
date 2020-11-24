import React from "react"
import { render, fireEvent, waitFor } from "@testing-library/react-native"
import { useNavigation } from "@react-navigation/native"

import ProductAnalyticsConsentScreen from "./ProductAnalyticsConsentScreen"
import { factories } from "../factories"
import { ProductAnalyticsContext } from "../ProductAnalytics/Context"

jest.mock("@react-navigation/native")

describe("ProductAnalyticsConsentScreen", () => {
  describe("when the user has consented to data sharing", () => {
    it("displays the correct status", () => {
      const context = factories.productAnalyticsContext.build({
        userConsentedToAnalytics: true,
      })
      ;(useNavigation as jest.Mock).mockReturnValue({
        setOptions: jest.fn(),
      })
      const { getByText } = render(
        <ProductAnalyticsContext.Provider value={context}>
          <ProductAnalyticsConsentScreen />
        </ProductAnalyticsContext.Provider>,
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
        const context = factories.productAnalyticsContext.build({
          userConsentedToAnalytics: true,
          updateUserConsent,
        })
        const { getByLabelText } = render(
          <ProductAnalyticsContext.Provider value={context}>
            <ProductAnalyticsConsentScreen />
          </ProductAnalyticsContext.Provider>,
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

  describe("when the user has not consented to data sharing", () => {
    it("displays the correct button text", () => {
      const context = factories.productAnalyticsContext.build({
        userConsentedToAnalytics: false,
      })
      ;(useNavigation as jest.Mock).mockReturnValue({
        setOptions: jest.fn(),
      })
      const { getByText } = render(
        <ProductAnalyticsContext.Provider value={context}>
          <ProductAnalyticsConsentScreen />
        </ProductAnalyticsContext.Provider>,
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
        const context = factories.productAnalyticsContext.build({
          userConsentedToAnalytics: false,
          updateUserConsent,
        })
        const { getByLabelText } = render(
          <ProductAnalyticsContext.Provider value={context}>
            <ProductAnalyticsConsentScreen />
          </ProductAnalyticsContext.Provider>,
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
