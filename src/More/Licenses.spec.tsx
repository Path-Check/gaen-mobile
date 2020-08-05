import React from "react"
import "react-native"
import { render, wait } from "@testing-library/react-native"
import "@testing-library/jest-native/extend-expect"
import { useNavigation, useFocusEffect } from "@react-navigation/native"
import { useApplicationName } from "./useApplicationInfo"

import LicensesScreen from "./Licenses"

jest.mock("@react-navigation/native")
jest.mock("./useApplicationInfo")
;(useNavigation as jest.Mock).mockReturnValue({ navigate: jest.fn() })
;(useFocusEffect as jest.Mock).mockReturnValue({ navigate: jest.fn() })

describe("LicensesScreen", () => {
  it("shows the name of the application", async () => {
    const applicationName = "application name"

    ;(useApplicationName as jest.Mock).mockReturnValueOnce({
      applicationName,
    })

    const { getByText } = render(<LicensesScreen />)

    await wait(() => {
      expect(getByText(applicationName)).toBeDefined()
    })
  })
})
