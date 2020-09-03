import React from "react"
import { render, fireEvent, waitFor } from "@testing-library/react-native"
import { Linking } from "react-native"

import AboutScreen from "./About"
import { useApplicationInfo } from "../hooks/useApplicationInfo"
import { ConfigurationContext } from "../ConfigurationContext"
import { factories } from "../factories"
import useAuthorityLinks from "../configuration/useAuthorityLinks"

jest.mock("../configuration/useAuthorityLinks")
jest.mock("../hooks/useApplicationInfo")
describe("About", () => {
  it("shows the name of the application", () => {
    const applicationName = "application name"
    ;(useApplicationInfo as jest.Mock).mockReturnValueOnce({
      applicationName,
      versionInfo: "versionInfo",
    })
    const { getByText } = render(<AboutScreen />)

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

    const { getByText } = render(<AboutScreen />)

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

    const { getByText } = render(<AboutScreen />)

    expect(getByText(`${mockOsName} v${mockOsVersion}`)).toBeDefined()
  })

  it("shows the screen description with the app name and the authority", () => {
    const healthAuthorityName = "authority name"
    const applicationName = "applicationName"

    ;(useApplicationInfo as jest.Mock).mockReturnValueOnce({
      applicationName,
      versionInfo: "versionInfo",
    })

    const { getByText } = render(
      <ConfigurationContext.Provider
        value={factories.configurationContext.build({ healthAuthorityName })}
      >
        <AboutScreen />
      </ConfigurationContext.Provider>,
    )

    expect(
      getByText(
        `The ${applicationName} app is made available by ${healthAuthorityName}`,
      ),
    ).toBeDefined()
  })

  it("navigates to the authority links when clicked", async () => {
    const url = "overrideUrl"
    const label = "labelOverride"

    const authorityLinks = [{ url, label }]
    const useAuthorityLinksSpy = useAuthorityLinks as jest.Mock
    useAuthorityLinksSpy.mockReturnValueOnce(authorityLinks)
    ;(useApplicationInfo as jest.Mock).mockReturnValueOnce({
      applicationName: "applicationName",
      versionInfo: "versionInfo",
    })
    const openURLSpy = jest.spyOn(Linking, "openURL")

    const { getByLabelText } = render(<AboutScreen />)

    fireEvent.press(getByLabelText(label))

    await waitFor(() => {
      expect(useAuthorityLinksSpy).toHaveBeenCalledWith("about", "en")
      expect(openURLSpy).toHaveBeenCalledWith(url)
    })
  })
})
