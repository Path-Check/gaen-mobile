import React from "react"
import { render, fireEvent, waitFor } from "@testing-library/react-native"
import { Linking } from "react-native"

import { SettingsStackScreens } from "../navigation"
import SettingsScreen from "./index"
import { useNavigation } from "@react-navigation/native"
import { useApplicationInfo } from "../Device/useApplicationInfo"
import {
  loadAuthorityLinks,
  applyTranslations,
} from "../configuration/authorityLinks"

jest.mock("@react-navigation/native")
jest.mock("../configuration/authorityLinks")
jest.mock("../Device/useApplicationInfo")

describe("Settings", () => {
  describe("when the user deletes their data", () => {
    it("navigates them to a confirmation screen", () => {
      const navigateSpy = jest.fn()
      ;(useNavigation as jest.Mock).mockReturnValue({ navigate: navigateSpy })
      ;(useApplicationInfo as jest.Mock).mockReturnValueOnce({
        applicationName: "name",
      })

      const { getByLabelText } = render(<SettingsScreen />)

      const deleteMyDataButton = getByLabelText("Delete my data")
      fireEvent.press(deleteMyDataButton)
      expect(navigateSpy).toHaveBeenCalledWith(
        SettingsStackScreens.DeleteConfirmation,
      )
    })
  })

  it("shows the build and version number of the application", () => {
    const buildNumber = "8"
    const versionNumber = "0.18"
    const versionInfo = `${versionNumber} (${buildNumber})`
    ;(useApplicationInfo as jest.Mock).mockReturnValueOnce({
      applicationName: "name",
      versionInfo,
    })

    const { getByText } = render(<SettingsScreen />)

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

    const { getByText } = render(<SettingsScreen />)

    expect(getByText(`${mockOsName} v${mockOsVersion}`)).toBeDefined()
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

    const { getByLabelText } = render(<SettingsScreen />)

    fireEvent.press(getByLabelText(label))

    await waitFor(() => {
      expect(loadAuthorityLinksSpy).toHaveBeenCalledWith("about")
      expect(applyTranslationsSpy).toHaveBeenCalledWith([], "en")
      expect(openURLSpy).toHaveBeenCalledWith(url)
    })
  })
})
