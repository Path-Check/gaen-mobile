import React, { FunctionComponent } from "react"
import { Text } from "react-native"
import { waitFor, render } from "@testing-library/react-native"

import { getVersion, getBuildNumber, getApplicationName } from "../Device"
import { useApplicationName, useVersionInfo } from "./useApplicationInfo"

jest.mock("../Device/nativeModule")

describe("useApplicationName", () => {
  it("fetches the application name from the module", async () => {
    const applicationName = "applicationName"
    ;(getApplicationName as jest.Mock).mockResolvedValueOnce(applicationName)
    const Container: FunctionComponent = () => {
      const { applicationName } = useApplicationName()
      return <Text>{applicationName}</Text>
    }

    const { getByText } = render(<Container />)

    await waitFor(() => {
      expect(getByText(applicationName)).toBeDefined()
    })
  })
})

describe("useVersionInfo", () => {
  it("fetches the version and build number from the native modules", async () => {
    const version = "version"
    const buildNumber = 1
    const resultingVersionInfo = `${version} (${buildNumber})`
    ;(getVersion as jest.Mock).mockResolvedValueOnce(version)
    ;(getBuildNumber as jest.Mock).mockResolvedValueOnce(buildNumber)
    const Container: FunctionComponent = () => {
      const { versionInfo } = useVersionInfo()
      return <Text>{versionInfo}</Text>
    }

    const { getByText } = render(<Container />)

    await waitFor(() => {
      expect(getByText(resultingVersionInfo)).toBeDefined()
    })
  })
})
