import React from "react"
import { Linking } from "react-native"
import "react-native"
import { render, waitFor, fireEvent } from "@testing-library/react-native"
import "@testing-library/jest-native/extend-expect"
import { useNavigation, useFocusEffect } from "@react-navigation/native"

import { useApplicationName } from "../Device/useApplicationInfo"
import { ConfigurationContext } from "../ConfigurationContext"
import { factories } from "../factories"
import {
  loadAuthorityLinks,
  applyTranslations,
} from "../configuration/authorityLinks"
import Legal from "./Legal"

jest.mock("@react-navigation/native")
jest.mock("../Device/useApplicationInfo")
jest.mock("../configuration/authorityLinks")
;(useNavigation as jest.Mock).mockReturnValue({ navigate: jest.fn() })
;(useFocusEffect as jest.Mock).mockReturnValue({ navigate: jest.fn() })

describe("Legal", () => {
  it("shows the name of the application", async () => {
    const applicationName = "application name"

    ;(useApplicationName as jest.Mock).mockReturnValueOnce({
      applicationName,
    })

    const { getByText } = render(<Legal />)

    await waitFor(() => {
      expect(getByText(applicationName)).toBeDefined()
    })
  })

  it("shows the authority name of the application", () => {
    const healthAuthorityName = "authority name"

    ;(useApplicationName as jest.Mock).mockReturnValueOnce({
      applicationName: "applicationName",
    })

    const { getByText } = render(
      <ConfigurationContext.Provider
        value={factories.configurationContext.build({ healthAuthorityName })}
      >
        <Legal />
      </ConfigurationContext.Provider>,
    )

    expect(getByText(healthAuthorityName)).toBeDefined()
  })

  describe("authority legal privacy policy url", () => {
    it("displays the link and can navigate to it if present", async () => {
      const healthAuthorityLegalPrivacyPolicyUrl = "authorityPrivacyPolicyUrl"

      ;(useApplicationName as jest.Mock).mockReturnValueOnce({
        applicationName: "applicationName",
      })

      const openURLSpy = jest.spyOn(Linking, "openURL")

      const { getByLabelText } = render(
        <ConfigurationContext.Provider
          value={factories.configurationContext.build({
            healthAuthorityLegalPrivacyPolicyUrl,
          })}
        >
          <Legal />
        </ConfigurationContext.Provider>,
      )

      fireEvent.press(getByLabelText("Privacy Policy"))

      await waitFor(() => {
        expect(openURLSpy).toHaveBeenCalledWith(
          healthAuthorityLegalPrivacyPolicyUrl,
        )
      })
    })

    it("hides the link if the value is not provided", () => {
      const healthAuthorityLegalPrivacyPolicyUrl = null
      ;(useApplicationName as jest.Mock).mockReturnValueOnce({
        applicationName: "applicationName",
      })

      const { queryByLabelText } = render(
        <ConfigurationContext.Provider
          value={factories.configurationContext.build({
            healthAuthorityLegalPrivacyPolicyUrl,
          })}
        >
          <Legal />
        </ConfigurationContext.Provider>,
      )

      expect(queryByLabelText("Privacy Policy")).toBeNull()
    })
  })

  it("navigates to the authority links when clicked", async () => {
    const url = "overrideUrl"
    const label = "labelOverride"

    const authorityLinks = [{ url, label }]
    const loadAuthorityLinksSpy = loadAuthorityLinks as jest.Mock
    loadAuthorityLinksSpy.mockReturnValueOnce([])
    const applyTranslationsSpy = applyTranslations as jest.Mock
    applyTranslationsSpy.mockReturnValueOnce(authorityLinks)
    ;(useApplicationName as jest.Mock).mockReturnValueOnce({
      applicationName: "applicationName",
    })
    const openURLSpy = jest.spyOn(Linking, "openURL")

    const { getByLabelText } = render(<Legal />)

    fireEvent.press(getByLabelText(label))

    await waitFor(() => {
      expect(loadAuthorityLinksSpy).toHaveBeenCalledWith("legal")
      expect(applyTranslationsSpy).toHaveBeenCalledWith([], "en")
      expect(openURLSpy).toHaveBeenCalledWith(url)
    })
  })
})
