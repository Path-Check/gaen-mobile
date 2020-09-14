import React from "react"
import { useNavigation } from "@react-navigation/native"
import { render, fireEvent, waitFor } from "@testing-library/react-native"

import { postCallbackInfo } from "./callbackAPI"
import Form from "./Form"
import { CallbackStackScreens } from "../navigation"

jest.mock("./callbackAPI")
jest.mock("@react-navigation/native")
describe("Form", () => {
  it("navigates to the success screen on a requested call back", async () => {
    const navigateSpy = jest.fn()
    ;(useNavigation as jest.Mock).mockReturnValueOnce({ navigate: navigateSpy })
    ;(postCallbackInfo as jest.Mock).mockResolvedValueOnce({ kind: "success" })
    const { getByLabelText } = render(<Form />)

    fireEvent.press(getByLabelText("Submit"))
    await waitFor(() => {
      expect(navigateSpy).toHaveBeenCalledWith(CallbackStackScreens.Success)
    })
  })
})
