import React from "react"
import { useNavigation } from "@react-navigation/native"
import { render, cleanup, fireEvent } from "@testing-library/react-native"
import "@testing-library/jest-native/extend-expect"

import ShareDiagnosis from "./ShareDiagnosis"
import { Screens } from "../navigation"
import { isPlatformiOS } from "../Util"

afterEach(cleanup)

jest.mock("@react-navigation/native")
jest.mock("../Util")

describe("ShareDiagnosis", () => {
  describe("and platform is Android", () => {
    it("navigates next to Enable Exposure Notfications ", () => {
      const navigateMock = jest.fn()

      ;(useNavigation as jest.Mock).mockReturnValue({
        navigate: navigateMock,
      })
      ;(isPlatformiOS as jest.Mock).mockReturnValue(false)

      const { getByLabelText } = render(<ShareDiagnosis />)

      const button = getByLabelText("Next")
      fireEvent.press(button)

      expect(navigateMock).toHaveBeenCalledWith(
        Screens.EnableExposureNotifications,
      )
    })
  })

  describe("and platform is iOS", () => {
    it("navigates next to BT Notification Permissions", () => {
      const navigateMock = jest.fn()

      ;(useNavigation as jest.Mock).mockReturnValue({
        navigate: navigateMock,
      })
      ;(isPlatformiOS as jest.Mock).mockReturnValue(true)
      const { getByLabelText } = render(<ShareDiagnosis />)

      const button = getByLabelText("Next")
      fireEvent.press(button)

      expect(navigateMock).toHaveBeenCalledWith(Screens.NotificationPermissions)
    })
  })
})
