import { render, fireEvent } from "@testing-library/react-native"
import React from "react"
import Settings from "."
import { useNavigation } from "@react-navigation/native"
import { Stacks, ModalStackScreens } from "../navigation"

jest.mock("@react-navigation/native")

describe("Settings", () => {
  describe('when the user taps "Delete All Data"', () => {
    it("presents a confirmation modal", () => {
      const navigateSpy = jest.fn()
      ;(useNavigation as jest.Mock).mockReturnValue({ navigate: navigateSpy })
      const { getByLabelText } = render(<Settings />)

      const deleteMyDataButton = getByLabelText("Delete All Data")
      fireEvent.press(deleteMyDataButton)
      expect(navigateSpy).toHaveBeenCalledWith(Stacks.Modal, {
        screen: ModalStackScreens.DeleteConfirmation,
      })
    })
  })
})
