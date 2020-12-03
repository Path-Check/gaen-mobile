import React from "react"
import { render, fireEvent } from "@testing-library/react-native"

import Complete from "./Complete"
import { AffectedUserContext } from "./AffectedUserContext"

jest.mock("@react-navigation/native")
describe("Complete", () => {
  it("displays information about completing the flow", () => {
    const { getByText } = render(
      <AffectedUserContext.Provider
        value={{
          hmacKey: "hmacKey",
          certificate: "certificate",
          setExposureSubmissionCredentials: jest.fn(),
          setExposureKeys: jest.fn(),
          exposureKeys: [],
          navigateOutOfStack: () => {},
        }}
      >
        <Complete />
      </AffectedUserContext.Provider>,
    )
    expect(getByText("Thanks for keeping your community safe!")).toBeDefined()
    expect(
      getByText(
        "You’re helping contain the spread of the virus and protect others in your community.",
      ),
    ).toBeDefined()
  })

  it("navigates to the home screen when user press on done", () => {
    const navigateOutOfStackSpy = jest.fn()
    const { getByLabelText } = render(
      <AffectedUserContext.Provider
        value={{
          hmacKey: "hmacKey",
          certificate: "certificate",
          setExposureSubmissionCredentials: jest.fn(),
          setExposureKeys: jest.fn(),
          exposureKeys: [],
          navigateOutOfStack: navigateOutOfStackSpy,
        }}
      >
        <Complete />
      </AffectedUserContext.Provider>,
    )

    fireEvent.press(getByLabelText("Done"))
    expect(navigateOutOfStackSpy).toHaveBeenCalled()
  })
})
