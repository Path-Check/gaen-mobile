import React from "react"
import { render, fireEvent, waitFor } from "@testing-library/react-native"
import { useNavigation } from "@react-navigation/native"
import { Linking } from "react-native"

import AcceptTermsOfService from "./AcceptTermsOfService"
import { ConfigurationContext } from "../ConfigurationContext"
import { factories } from "../factories"
import { OnboardingProvider } from "../OnboardingContext"

jest.mock("@react-navigation/native")
;(useNavigation as jest.Mock).mockReturnValue({ navigate: jest.fn() })

describe("AcceptTermsOfService", () => {
  it("won't continue until a user accepts the terms of use", async () => {
    const navigationSpy = jest.fn()
    ;(useNavigation as jest.Mock).mockReturnValue({ navigate: navigationSpy })

    const { getByLabelText, getByTestId } = render(
      <OnboardingProvider userHasCompletedOnboarding>
        <AcceptTermsOfService />
      </OnboardingProvider>,
    )

    const continueButton = getByLabelText("Continue")
    fireEvent.press(continueButton)

    expect(navigationSpy).not.toHaveBeenCalled()
    expect(getByLabelText("Unchecked checkbox")).toBeDefined()

    fireEvent.press(getByTestId("accept-terms-of-use-checkbox"))
    fireEvent.press(continueButton)

    await waitFor(() => {
      expect(getByLabelText("Checked checkbox")).toBeDefined()
      expect(navigationSpy).toHaveBeenCalled()
    })
  })

  it("links out to the privacy policy", async () => {
    const linkSpy = jest.spyOn(Linking, "openURL")
    const { getByText } = render(
      <OnboardingProvider userHasCompletedOnboarding>
        <AcceptTermsOfService />
      </OnboardingProvider>,
    )

    fireEvent.press(getByText(/Privacy Policy/))

    await waitFor(() => {
      expect(linkSpy).toHaveBeenCalled()
    })
  })

  it("opens the link to the eula if present", async () => {
    const healthAuthorityEulaUrl = "healthAuthorityEulaUrl"
    const linkSpy = jest.spyOn(Linking, "openURL")
    const { getByText } = render(
      <OnboardingProvider userHasCompletedOnboarding>
        <ConfigurationContext.Provider
          value={factories.configurationContext.build({
            healthAuthorityEulaUrl,
          })}
        >
          <AcceptTermsOfService />
        </ConfigurationContext.Provider>
      </OnboardingProvider>,
    )

    fireEvent.press(getByText(/End User Legal Agreement/))

    await waitFor(() => {
      expect(linkSpy).toHaveBeenCalledWith(healthAuthorityEulaUrl)
    })
  })

  it("does not show the eula link if the url is null", () => {
    const healthAuthorityEulaUrl = null
    const { queryByText } = render(
      <OnboardingProvider userHasCompletedOnboarding>
        <ConfigurationContext.Provider
          value={factories.configurationContext.build({
            healthAuthorityEulaUrl,
          })}
        >
          <AcceptTermsOfService />
        </ConfigurationContext.Provider>
      </OnboardingProvider>,
    )

    expect(queryByText(/End User Legal Agreement/)).toBeNull()
  })
})
