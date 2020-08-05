import React from "react"
import { Linking } from "react-native"
import { render, fireEvent, wait } from "@testing-library/react-native"

import AboutScreen from "./About"
import * as NativeModule from "../gaen/nativeModule"

describe("About", () => {
  it("shows the name of the application", async () => {
    const applicationName = "application name"

    const applicationNameSpy = jest
      .spyOn(NativeModule, "getApplicationName")
      .mockReturnValue(Promise.resolve(applicationName))

    const { getByText } = render(<AboutScreen />)

    await wait(() => {
      expect(applicationNameSpy).toHaveBeenCalled()
      expect(getByText(applicationName)).toBeDefined()
    })
  })

  it("shows the build and version number of the application", async () => {
    const buildNumber = "8"
    const versionNumber = "0.18"
    const fullString = `${versionNumber} (${buildNumber})`

    const buildNumberSpy = jest
      .spyOn(NativeModule, "getBuildNumber")
      .mockReturnValue(Promise.resolve(buildNumber))
    const versionSpy = jest
      .spyOn(NativeModule, "getVersion")
      .mockReturnValue(Promise.resolve(versionNumber))

    const { getByText } = render(<AboutScreen />)

    await wait(() => {
      expect(buildNumberSpy).toHaveBeenCalled()
      expect(versionSpy).toHaveBeenCalled()
      expect(getByText("Version:")).toBeDefined()
      expect(getByText(fullString)).toBeDefined()
    })
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
