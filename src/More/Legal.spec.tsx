import React from "react"
import "react-native"
import { render, waitFor, fireEvent } from "@testing-library/react-native"
import "@testing-library/jest-native/extend-expect"
import { useNavigation, useFocusEffect } from "@react-navigation/native"
import { useApplicationName } from "../hooks/useApplicationInfo"

import Legal from "./Legal"
import { Linking } from "react-native"
import { ConfigurationContext } from "../ConfigurationContext"
import { factories } from "../factories"

jest.mock("@react-navigation/native")
jest.mock("../hooks/useApplicationInfo")
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

  it("navigates to the authority privacy policy url", async () => {
    const healthAuthorityPrivacyPolicyUrl = "authorityPrivacyPolicyUrl"

    ;(useApplicationName as jest.Mock).mockReturnValueOnce({
      applicationName: "applicationName",
    })

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
})
