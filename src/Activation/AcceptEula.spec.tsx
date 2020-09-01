import React from "react"
import { render, fireEvent, waitFor } from "@testing-library/react-native"
import { useNavigation } from "@react-navigation/native"
import { Linking } from "react-native"

import AcceptEula from "./AcceptEula"

jest.mock("@react-navigation/native")
;(useNavigation as jest.Mock).mockReturnValue({ navigate: jest.fn() })

describe("EulaModal", () => {
  it("won't continue until a user accepts the terms of use", async () => {
    const navigationSpy = jest.fn()
    ;(useNavigation as jest.Mock).mockReturnValue({ navigate: navigationSpy })

    const { getByLabelText, getByTestId } = render(<AcceptEula />)

    const continueButton = getByLabelText("Continue")
    fireEvent.press(continueButton)

    expect(navigationSpy).not.toHaveBeenCalled()
    expect(getByLabelText("Unchecked checkbox")).toBeDefined()

    fireEvent.press(getByTestId("accept-terms-of-use-checkbox"))
    fireEvent.press(continueButton)

    await waitFor(() => {
      expect(getByLabelText("Checked checkbox")).toBeDefined()
      expect(navigationSpy).toHaveBeenCalledWith("ActivateProximityTracing")
    })
  })

  it("links out to the privacy policy", async () => {
    const linkSpy = jest.spyOn(Linking, "openURL")
    const { getByText } = render(<AcceptEula />)

    fireEvent.press(getByText(/Privacy Policy/))

    await waitFor(() => {
      expect(linkSpy).toHaveBeenCalled()
    })
  })
})
