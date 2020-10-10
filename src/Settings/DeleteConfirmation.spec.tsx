import React from "react"
import { fireEvent, render, waitFor } from "@testing-library/react-native"
import { showMessage } from "react-native-flash-message"

import { SymptomLogContext } from "../MyHealth/SymptomLogContext"
import { OnboardingProvider } from "../OnboardingContext"
import { failureResponse, SUCCESS_RESPONSE } from "../OperationResponse"
import DeleteConfirmation from "./DeleteConfirmation"
import { factories } from "../factories"

jest.mock("react-native-flash-message")
jest.mock("@react-navigation/native")

describe("DeleteConfirmation", () => {
  it("allows users to delete their data", async () => {
    const deleteAllLogEntriesSpy = jest.fn()
    deleteAllLogEntriesSpy.mockResolvedValueOnce(SUCCESS_RESPONSE)

    const { getByLabelText } = render(
      <OnboardingProvider userHasCompletedOnboarding={false}>
        <SymptomLogContext.Provider
          value={factories.symptomLogContext.build({
            deleteAllLogEntries: deleteAllLogEntriesSpy,
          })}
        >
          <DeleteConfirmation />
        </SymptomLogContext.Provider>
      </OnboardingProvider>,
    )

    fireEvent.press(getByLabelText("Delete My Data"))
    await waitFor(() => {
      expect(deleteAllLogEntriesSpy).toHaveBeenCalled()
    })
  })

  describe("when data deletion is successful", () => {
    it("presents a success message", async () => {
      const showMessageSpy = showMessage as jest.Mock
      const deleteAllLogEntriesSpy = jest.fn()
      deleteAllLogEntriesSpy.mockResolvedValueOnce(SUCCESS_RESPONSE)

      const { getByLabelText } = render(
        <OnboardingProvider userHasCompletedOnboarding={false}>
          <SymptomLogContext.Provider
            value={factories.symptomLogContext.build({
              deleteAllLogEntries: deleteAllLogEntriesSpy,
            })}
          >
            <DeleteConfirmation />
          </SymptomLogContext.Provider>
        </OnboardingProvider>,
      )

      fireEvent.press(getByLabelText("Delete My Data"))
      await waitFor(() => {
        expect(showMessageSpy).toHaveBeenCalledWith(
          expect.objectContaining({
            message: "Data deleted",
          }),
        )
      })
    })
  })

  describe("when data deletion fails", () => {
    it("presents an error message", async () => {
      const showMessageSpy = showMessage as jest.Mock
      const deleteAllLogEntriesSpy = jest.fn()
      deleteAllLogEntriesSpy.mockResolvedValueOnce(
        failureResponse("operation failed"),
      )

      const { getByLabelText } = render(
        <OnboardingProvider userHasCompletedOnboarding={false}>
          <SymptomLogContext.Provider
            value={factories.symptomLogContext.build({
              deleteAllLogEntries: deleteAllLogEntriesSpy,
            })}
          >
            <DeleteConfirmation />
          </SymptomLogContext.Provider>
        </OnboardingProvider>,
      )

      fireEvent.press(getByLabelText("Delete My Data"))
      await waitFor(() => {
        expect(showMessageSpy).toHaveBeenCalledWith(
          expect.objectContaining({
            message: "Sorry, we could not delete your data",
          }),
        )
      })
    })
  })
})
