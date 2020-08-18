import React from "react"
import { render } from "@testing-library/react-native"

import AboutScreen from "./About"
import { useApplicationInfo } from "./useApplicationInfo"

jest.mock("./useApplicationInfo")
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
})
