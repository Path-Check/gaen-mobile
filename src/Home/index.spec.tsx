import React from "react"
import { Share } from "react-native"
import { render, fireEvent } from "@testing-library/react-native"
import { useNavigation } from "@react-navigation/native"
import "@testing-library/jest-native/extend-expect"

import Home from "./index"
import { HomeStackScreens } from "../navigation"
import { factories } from "../factories"
import { ConfigurationContext } from "../ConfigurationContext"
import { PermissionsContext } from "../Device/PermissionsContext"

jest.mock("@react-navigation/native")

const mockedApplicationName = "applicationName"
jest.mock("../Device/useApplicationInfo", () => {
  return {
    useApplicationName: () => {
      return {
        applicationName: mockedApplicationName,
      }
    },
  }
})

describe("Home", () => {
  it("allows the user to get more information on Exposure Detection status", () => {
    const navigateSpy = jest.fn()
    ;(useNavigation as jest.Mock).mockReturnValue({
      navigate: navigateSpy,
    })

    const { getByTestId } = render(<Home />)

    fireEvent.press(getByTestId("exposure-scanning-status-button"))
    expect(navigateSpy).toHaveBeenCalledWith(
      HomeStackScreens.ExposureDetectionStatus,
    )
  })

  it("allows users to share the application", () => {
    const configuration = factories.configurationContext.build()
    Share.share = jest.fn()

    const shareSpy = jest.spyOn(Share, "share")

    const { getByLabelText } = render(
      <ConfigurationContext.Provider value={configuration}>
        <Home />
      </ConfigurationContext.Provider>,
    )

    fireEvent.press(getByLabelText(`Share ${mockedApplicationName}`))

    expect(shareSpy).toHaveBeenCalledWith({
      message: `Check out this app ${mockedApplicationName}, which can help us contain COVID-19! ${configuration.appDownloadUrl}`,
    })
  })

  describe("When the exposure notification status is active", () => {
    it("renders an on message", () => {
      const permissionProviderValue = factories.permissionsContext.build({
        exposureNotifications: { status: "Active" },
      })

      const { getByText } = render(
        <PermissionsContext.Provider value={permissionProviderValue}>
          <Home />
        </PermissionsContext.Provider>,
      )

      expect(getByText("Exposure Detection On")).toBeDefined()
    })
  })

  describe("When the exposure notifications status is not active because location is off", () => {
    it("renders an off message", () => {
      const permissionProviderValue = factories.permissionsContext.build({
        exposureNotifications: { status: "LocationOffAndRequired" },
      })

      const { getByText } = render(
        <PermissionsContext.Provider value={permissionProviderValue}>
          <Home />
        </PermissionsContext.Provider>,
      )

      expect(getByText("Exposure Detection Off")).toBeDefined()
    })
  })

  describe("When exposure notifications are disabled", () => {
    it("renders an off message", () => {
      const permissionProviderValue = factories.permissionsContext.build({
        exposureNotifications: { status: "Disabled" },
      })

      const { getByText } = render(
        <PermissionsContext.Provider value={permissionProviderValue}>
          <Home />
        </PermissionsContext.Provider>,
      )

      expect(getByText("Exposure Detection Off")).toBeDefined()
    })
  })

  describe("When exposure notifications are unauthorized", () => {
    it("renders an off message", () => {
      const permissionProviderValue = factories.permissionsContext.build({
        exposureNotifications: { status: "Unauthorized" },
      })

      const { getByText } = render(
        <PermissionsContext.Provider value={permissionProviderValue}>
          <Home />
        </PermissionsContext.Provider>,
      )

      expect(getByText("Exposure Detection Off")).toBeDefined()
    })
  })
})
