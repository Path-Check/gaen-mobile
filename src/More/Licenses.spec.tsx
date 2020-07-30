import React from "react"
import "react-native"
import { render } from "@testing-library/react-native"
import "@testing-library/jest-native/extend-expect"
import { useNavigation, useFocusEffect } from "@react-navigation/native"
import { getApplicationName } from "react-native-device-info"

import LicensesScreen from "./Licenses"

jest.mock("react-native-device-info", () => {
  return {
    getApplicationName: jest.fn(),
  }
})

jest.mock("@react-navigation/native")
;(useNavigation as jest.Mock).mockReturnValue({ navigate: jest.fn() })
;(useFocusEffect as jest.Mock).mockReturnValue({ navigate: jest.fn() })

describe("LicensesScreen", () => {
  it("shows the name of the application", () => {
    const applicationName = "application name"

    ;(getApplicationName as jest.Mock).mockReturnValueOnce(applicationName)

    const { getByText } = render(<LicensesScreen />)

    expect(getByText(applicationName)).toBeDefined()
  })
})
