import React from "react"
import { render, fireEvent, waitFor } from "@testing-library/react-native"
import { useNavigation } from "@react-navigation/native"

import AnonymizedDataConsentScreen from "./AnonymizedDataConsentScreen"
import { factories } from "../factories"
import { AnalyticsContext } from "../AnalyticsContext"
import { applyModalHeader } from "../navigation/ModalHeader"

jest.mock("@react-navigation/native")
jest.mock("../navigation/ModalHeader")

describe("AnonymizedDataConsentScreen", () => {
  describe("when a user has consented to data sharing", () => {
    it("displays the correct status", () => {
      const context = factories.analyticsContext.build({
        userConsentedToAnalytics: true,
      })
      ;(useNavigation as jest.Mock).mockReturnValue({
        setOptions: jest.fn(),
      })
      const { getByText } = render(
        <AnalyticsContext.Provider value={context}>
          <AnonymizedDataConsentScreen />
        </AnalyticsContext.Provider>,
      )

      const buttonText = getByText("Stop Sharing Data")
      const headerText = "You are sharing anonymized data"

      expect(applyModalHeader).toHaveBeenCalledWith(headerText)
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
          <AnalyticsContext.Provider value={context}>
            <AnonymizedDataConsentScreen />
          </AnalyticsContext.Provider>,
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

  describe("when a user has not consented to data sharing", () => {
    it("displays the correct text", () => {
      const context = factories.analyticsContext.build({
        userConsentedToAnalytics: false,
      })
      ;(useNavigation as jest.Mock).mockReturnValue({
        setOptions: jest.fn(),
      })
      const { getByText } = render(
        <AnalyticsContext.Provider value={context}>
          <AnonymizedDataConsentScreen />
        </AnalyticsContext.Provider>,
      )

      const buttonText = getByText("I Understand and Consent")
      const headerText = "Share Anonymized Data"

      expect(buttonText).toBeDefined()
      expect(applyModalHeader).toHaveBeenCalledWith(headerText)
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
          <AnalyticsContext.Provider value={context}>
            <AnonymizedDataConsentScreen />
          </AnalyticsContext.Provider>,
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
