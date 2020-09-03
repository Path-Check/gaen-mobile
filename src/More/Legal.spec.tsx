import React from "react"
import { Linking } from "react-native"
import "react-native"
import { render, waitFor, fireEvent } from "@testing-library/react-native"
import "@testing-library/jest-native/extend-expect"
import { useNavigation, useFocusEffect } from "@react-navigation/native"

import { useApplicationName } from "../hooks/useApplicationInfo"
import useAuthorityLinks from "../configuration/useAuthorityLinks"
import Legal from "./Legal"
import { ConfigurationContext } from "../ConfigurationContext"
import { factories } from "../factories"

jest.mock("@react-navigation/native")
jest.mock("../hooks/useApplicationInfo")
jest.mock("../configuration/useAuthorityLinks")
;(useNavigation as jest.Mock).mockReturnValue({ navigate: jest.fn() })
;(useFocusEffect as jest.Mock).mockReturnValue({ navigate: jest.fn() })

describe("Legal", () => {
  it("shows the name of the application", async () => {
    const applicationName = "application name"

    ;(useApplicationName as jest.Mock).mockReturnValueOnce({
      applicationName,
    })
    ;(useAuthorityLinks as jest.Mock).mockReturnValueOnce([])

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
    ;(useAuthorityLinks as jest.Mock).mockReturnValueOnce([])
    const { getByText } = render(
      <ConfigurationContext.Provider
        value={factories.configurationContext.build({ healthAuthorityName })}
      >
        <Legal />
      </ConfigurationContext.Provider>,
    )

    expect(getByText(healthAuthorityName)).toBeDefined()
  })

  it("navigates to the authority privacy policy url", async () => {
    const healthAuthorityPrivacyPolicyUrl = "authorityPrivacyPolicyUrl"

    ;(useApplicationName as jest.Mock).mockReturnValueOnce({
      applicationName: "applicationName",
    })
    ;(useAuthorityLinks as jest.Mock).mockReturnValueOnce([])

    const openURLSpy = jest.spyOn(Linking, "openURL")

    const { getByLabelText } = render(
      <ConfigurationContext.Provider
        value={factories.configurationContext.build({
          healthAuthorityPrivacyPolicyUrl,
        })}
      >
        <Legal />
      </ConfigurationContext.Provider>,
    )

    fireEvent.press(getByLabelText("Privacy Policy"))

    await waitFor(() => {
      expect(openURLSpy).toHaveBeenCalledWith(healthAuthorityPrivacyPolicyUrl)
    })
  })

  it("navigates to the authority links when clicked", async () => {
    const url = "overrideUrl"
    const label = "labelOverride"

    const authorityLinks = [{ url, label }]
    const useAuthorityLinksSpy = useAuthorityLinks as jest.Mock
    useAuthorityLinksSpy.mockReturnValueOnce(authorityLinks)
    ;(useApplicationName as jest.Mock).mockReturnValueOnce({
      applicationName: "applicationName",
    })
    const openURLSpy = jest.spyOn(Linking, "openURL")

    const { getByLabelText } = render(<Legal />)

    fireEvent.press(getByLabelText(label))

    await waitFor(() => {
      expect(useAuthorityLinksSpy).toHaveBeenCalledWith("legal", "en")
      expect(openURLSpy).toHaveBeenCalledWith(url)
    })
  })
})
