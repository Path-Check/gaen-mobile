import React from "react"
import { useNavigation } from "@react-navigation/native"
import { render, fireEvent } from "@testing-library/react-native"

import Success from "./Success"
import { CallbackFormContext } from "./CallbackFormContext"

jest.mock("@react-navigation/native")

describe("Success", () => {
  it("displays the title and body for the call back success", () => {
    const jestMock = useNavigation as jest.Mock
    jestMock.mockReturnValueOnce({
      setOptions: jest.fn(),
    })

    const { queryByText } = render(
      <CallbackFormContext.Provider
        value={{ callBackRequestCompleted: jest.fn() }}
      >
        <Success />
      </CallbackFormContext.Provider>,
    )

    expect(queryByText("You're in the queue")).toBeDefined()
    expect(
      queryByText(
        `Our contact tracers are working hard to keep you and your community safe.`,
      ),
    ).toBeDefined()
  })

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
