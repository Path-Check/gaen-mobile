import React from "react"
import { Alert } from "react-native"
import { fireEvent, render } from "@testing-library/react-native"

import { OnboardingProvider } from "../OnboardingContext"
import DeleteConfirmation from "./DeleteConfirmation"

jest.mock("@react-navigation/native")

describe("DeleteConfirmation", () => {
  it("shows a confirmation alert if the user presses delete my data", () => {
    const alertSpy = jest.spyOn(Alert, "alert")

    const { getByLabelText } = render(
      <OnboardingProvider userHasCompletedOnboarding>
        <DeleteConfirmation />
      </OnboardingProvider>,
    )

    fireEvent.press(getByLabelText("Delete my data"))
    expect(alertSpy).toHaveBeenCalled()
  })
})
