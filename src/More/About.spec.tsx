import React from "react"
import { Linking } from "react-native"
import { render, fireEvent } from "@testing-library/react-native"
import {
  getApplicationName,
  getVersion,
  getBuildNumber,
} from "react-native-device-info"

import AboutScreen from "./About"

jest.mock("react-native-device-info", () => {
  return {
    getApplicationName: jest.fn(),
    getBuildNumber: jest.fn(),
    getVersion: jest.fn(),
  }
})

describe("About", () => {
  it("shows the name of the application", () => {
    const applicationName = "application name"

    ;(getApplicationName as jest.Mock).mockReturnValueOnce(applicationName)

    const { getByText } = render(<AboutScreen />)

    expect(getByText(applicationName)).toBeDefined()
  })

  it("shows the build and version number of the application", () => {
    const buildNumber = 8
    const versionNumber = 0.18

    ;(getBuildNumber as jest.Mock).mockReturnValueOnce(buildNumber)
    ;(getVersion as jest.Mock).mockReturnValueOnce(versionNumber)

    const { getByText } = render(<AboutScreen />)

    expect(getByText("Version:")).toBeDefined()
    expect(getByText(`${versionNumber} (${buildNumber})`)).toBeDefined()
  })

  it("navigates to the pathcheck organization when tapped on the url", () => {
    const openURLSpy = jest.spyOn(Linking, "openURL")

    const { getByText } = render(<AboutScreen />)

    fireEvent.press(getByText("pathcheck.org"))

    expect(openURLSpy).toHaveBeenCalledWith("https://pathcheck.org/")
  })

  it("shows the OS name and version", () => {
    const mockOsName = "osName"
    const mockOsVersion = "osVersion"
    jest.mock("react-native/Libraries/Utilities/Platform", () => {
      return { OS: mockOsName, Version: mockOsVersion }
    })

    const { getByText } = render(<AboutScreen />)

    expect(getByText(`${mockOsName} v${mockOsVersion}`)).toBeDefined()
  })
})
