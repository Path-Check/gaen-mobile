import React from "react"
import { Alert } from "react-native"
import { fireEvent, render } from "@testing-library/react-native"

import { SymptomHistoryContext } from "../SymptomHistory/SymptomHistoryContext"
import { OnboardingProvider } from "../OnboardingContext"
import DeleteConfirmation from "./DeleteConfirmation"
import { factories } from "../factories"

jest.mock("react-native-flash-message")
jest.mock("@react-navigation/native")

describe("DeleteConfirmation", () => {
  it("shows a confirmation alert if the user presses delete my data", () => {
    const alertSpy = jest.spyOn(Alert, "alert")

    const { getByLabelText } = render(
      <OnboardingProvider userHasCompletedOnboarding={false}>
        <SymptomHistoryContext.Provider
          value={factories.symptomHistoryContext.build({
            deleteAllEntries: jest.fn(),
          })}
        >
          <DeleteConfirmation />
        </SymptomHistoryContext.Provider>
      </OnboardingProvider>,
    )

    fireEvent.press(getByLabelText("Delete my data"))
    expect(alertSpy).toHaveBeenCalled()
  })
})
