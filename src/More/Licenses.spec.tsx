import React from "react"
import "react-native"
import { render, wait, act } from "@testing-library/react-native"
import "@testing-library/jest-native/extend-expect"
import { useNavigation, useFocusEffect } from "@react-navigation/native"

import LicensesScreen from "./Licenses"
import * as NativeModule from "../gaen/nativeModule"

jest.mock("@react-navigation/native")
;(useNavigation as jest.Mock).mockReturnValue({ navigate: jest.fn() })
;(useFocusEffect as jest.Mock).mockReturnValue({ navigate: jest.fn() })

describe("LicensesScreen", () => {
  it("shows the name of the application", async () => {
    jest.useFakeTimers()

    const applicationName = "application name"

    const applicationNameSpy = jest
      .spyOn(NativeModule, "getApplicationName")
      .mockReturnValue(Promise.resolve(applicationName))

    const { getByText } = render(<LicensesScreen />)

    act(() => {
      jest.advanceTimersByTime(1000)
    })

    await wait(() => {
      expect(applicationNameSpy).toHaveBeenCalled()
      expect(getByText(applicationName)).toBeDefined()
    })
  })
})
