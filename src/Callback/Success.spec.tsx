import React from "react"
import { useNavigation } from "@react-navigation/native"
import { render, fireEvent } from "@testing-library/react-native"

import Success from "./Success"
import { CallbackFormContext } from "./CallbackFormContext"
import { ConfigurationContext } from "../ConfigurationContext"
import { factories } from "../factories"

jest.mock("@react-navigation/native")

describe("Success", () => {
  it("displays the title and body for the call back success", () => {
    const healthAuthorityName = "healthAuthorityName"
    ;(useNavigation as jest.Mock).mockReturnValueOnce({
      setOptions: jest.fn(),
    })
    const { getByText } = render(
      <ConfigurationContext.Provider
        value={factories.configurationContext.build({ healthAuthorityName })}
      >
        <CallbackFormContext.Provider
          value={{ callBackRequestCompleted: jest.fn() }}
        >
          <Success />
        </CallbackFormContext.Provider>
      </ConfigurationContext.Provider>,
    )

    expect(getByText("You're in the queue")).toBeDefined()
    expect(
      getByText(
        `Our contact tracers are working hard to keep you and your community safe. The ${healthAuthorityName} has received your request for a call back. An expert will contact you within 24 hours.`,
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
