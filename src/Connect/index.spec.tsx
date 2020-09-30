import React from "react"
import { render, fireEvent, waitFor } from "@testing-library/react-native"
import { Linking } from "react-native"

import ConnectScreen from "./index"
import { useApplicationInfo } from "../hooks/useApplicationInfo"
import { ConfigurationContext } from "../ConfigurationContext"
import { factories } from "../factories"
import {
  loadAuthorityLinks,
  applyTranslations,
} from "../configuration/authorityLinks"

jest.mock("@react-navigation/native")
jest.mock("../configuration/authorityLinks")
jest.mock("../hooks/useApplicationInfo")

describe("Connect", () => {
  it("shows the name of the application", () => {
    const applicationName = "application name"
    ;(useApplicationInfo as jest.Mock).mockReturnValueOnce({
      applicationName,
      versionInfo: "versionInfo",
    })
    const { getByText } = render(<ConnectScreen />)

    expect(getByText(applicationName)).toBeDefined()
  })

  it("shows the build and version number of the application", () => {
    const buildNumber = "8"
    const versionNumber = "0.18"
    const versionInfo = `${versionNumber} (${buildNumber})`
    ;(useApplicationInfo as jest.Mock).mockReturnValueOnce({
      applicationName: "name",
      versionInfo,
    })

    const { getByText } = render(<ConnectScreen />)

    expect(getByText("Version:")).toBeDefined()
    expect(getByText(versionInfo)).toBeDefined()
  })

  it("shows the OS name and version", () => {
    const mockOsName = "osName"
    const mockOsVersion = "osVersion"
    jest.mock("react-native/Libraries/Utilities/Platform", () => {
      return { OS: mockOsName, Version: mockOsVersion }
    })
    ;(useApplicationInfo as jest.Mock).mockReturnValueOnce({
      applicationName: "name",
      versionInfo: "versionInfo",
    })

    const { getByText } = render(<ConnectScreen />)

    expect(getByText(`${mockOsName} v${mockOsVersion}`)).toBeDefined()
  })

  it("shows the screen description with the app name and the authority", () => {
    const healthAuthorityName = "authorityName"
    const applicationName = "applicationName"

    ;(useApplicationInfo as jest.Mock).mockReturnValueOnce({
      applicationName,
      versionInfo: "versionInfo",
    })

    const { getByText } = render(
      <ConfigurationContext.Provider
        value={factories.configurationContext.build({ healthAuthorityName })}
      >
        <ConnectScreen />
      </ConfigurationContext.Provider>,
    )

    expect(
      getByText(/The applicationName app is made available by authorityName/),
    ).toBeDefined()
  })

  it("navigates to the authority links when clicked", async () => {
    const url = "overrideUrl"
    const label = "labelOverride"

    const authorityLinks = [{ url, label }]
    const loadAuthorityLinksSpy = loadAuthorityLinks as jest.Mock
    loadAuthorityLinksSpy.mockReturnValueOnce([])
    const applyTranslationsSpy = applyTranslations as jest.Mock
    applyTranslationsSpy.mockReturnValueOnce(authorityLinks)
    ;(useApplicationInfo as jest.Mock).mockReturnValueOnce({
      applicationName: "applicationName",
      versionInfo: "versionInfo",
    })
    const openURLSpy = jest.spyOn(Linking, "openURL")

    const { getByLabelText } = render(<ConnectScreen />)

    fireEvent.press(getByLabelText(label))

    await waitFor(() => {
      expect(loadAuthorityLinksSpy).toHaveBeenCalledWith("about")
      expect(applyTranslationsSpy).toHaveBeenCalledWith([], "en")
      expect(openURLSpy).toHaveBeenCalledWith(url)
    })
  })

  it("dials the emergency phone number from the configuration", async () => {
    const emergencyPhoneNumber = "emergencyPhoneNumber"

    const openURLSpy = jest.spyOn(Linking, "openURL")
    ;(useApplicationInfo as jest.Mock).mockReturnValueOnce({
      applicationName: "applicationName",
      versionInfo: "versionInfo",
    })

    const { getByLabelText } = render(
      <ConfigurationContext.Provider
        value={factories.configurationContext.build({ emergencyPhoneNumber })}
      >
        <ConnectScreen />
      </ConfigurationContext.Provider>,
    )

    fireEvent.press(getByLabelText("Emergency Contact"))

    await waitFor(() => {
      expect(openURLSpy).toHaveBeenCalledWith(`tel:${emergencyPhoneNumber}`)
    })
  })
})
