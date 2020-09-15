import React from "react"
import { useNavigation } from "@react-navigation/native"
import { render, fireEvent } from "@testing-library/react-native"

import Success from "./Success"
import { CallbackFormContext } from "./CallbackFormContext"

jest.mock("@react-navigation/native")

describe("Success", () => {
  it("invokes the completed request property from the context", () => {
    const callBackRequestCompletedSpy = jest.fn()
    ;(useNavigation as jest.Mock).mockReturnValueOnce({ setOptions: jest.fn() })
    const { getByLabelText } = render(
      <CallbackFormContext.Provider
        value={{ callBackRequestCompleted: callBackRequestCompletedSpy }}
      >
        <Success />
      </CallbackFormContext.Provider>,
    )

    fireEvent.press(getByLabelText("Got it"))
    expect(callBackRequestCompletedSpy).toHaveBeenCalled()
  })
})
