import React from "react"
import { render, fireEvent } from "@testing-library/react-native"
import Settings from "."
import { useNavigation } from "@react-navigation/native"
import { SettingsStackScreens } from "../navigation"

jest.mock("@react-navigation/native")

describe("Settings", () => {
  describe('when the user taps "Delete All Data"', () => {
    it("presents a confirmation screen", () => {
      const navigateSpy = jest.fn()
      ;(useNavigation as jest.Mock).mockReturnValue({ navigate: navigateSpy })
      const { getByLabelText } = render(<Settings />)

      const deleteMyDataButton = getByLabelText("Delete My Data")
      fireEvent.press(deleteMyDataButton)
      expect(navigateSpy).toHaveBeenCalledWith(
        SettingsStackScreens.DeleteConfirmation,
      )
    })
  })
})
