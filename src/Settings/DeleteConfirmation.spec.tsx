import React from "react"
import { fireEvent, render, waitFor } from "@testing-library/react-native"
import { showMessage } from "react-native-flash-message"

import { SymptomHistoryContext } from "../SymptomHistory/SymptomHistoryContext"
import { OnboardingProvider } from "../OnboardingContext"
import { SUCCESS_RESPONSE } from "../OperationResponse"
import DeleteConfirmation from "./DeleteConfirmation"
import { factories } from "../factories"

jest.mock("react-native-flash-message")
jest.mock("@react-navigation/native")

describe("DeleteConfirmation", () => {
  it("allows users to delete their data", async () => {
    const deleteAllEntriesSpy = jest.fn()
    deleteAllEntriesSpy.mockResolvedValueOnce(SUCCESS_RESPONSE)

    const { getByLabelText } = render(
      <OnboardingProvider userHasCompletedOnboarding={false}>
        <SymptomHistoryContext.Provider
          value={factories.symptomHistoryContext.build({
            deleteAllEntries: deleteAllEntriesSpy,
          })}
        >
          <DeleteConfirmation />
        </SymptomHistoryContext.Provider>
      </OnboardingProvider>,
    )

    fireEvent.press(getByLabelText("Delete My Data"))
    await waitFor(() => {
      expect(deleteAllEntriesSpy).toHaveBeenCalled()
    })
  })

  describe("when data deletion is successful", () => {
    it("presents a success message", async () => {
      const showMessageSpy = showMessage as jest.Mock
      const deleteAllEntriesSpy = jest.fn()
      deleteAllEntriesSpy.mockResolvedValueOnce(SUCCESS_RESPONSE)

      const { getByLabelText } = render(
        <OnboardingProvider userHasCompletedOnboarding={false}>
          <SymptomHistoryContext.Provider
            value={factories.symptomHistoryContext.build({
              deleteAllEntries: deleteAllEntriesSpy,
            })}
          >
            <DeleteConfirmation />
          </SymptomHistoryContext.Provider>
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
      const deleteAllEntriesSpy = jest.fn()
      deleteAllEntriesSpy.mockResolvedValueOnce({ kind: "failure" })

      const { getByLabelText } = render(
        <OnboardingProvider userHasCompletedOnboarding={false}>
          <SymptomHistoryContext.Provider
            value={factories.symptomHistoryContext.build({
              deleteAllEntries: deleteAllEntriesSpy,
            })}
          >
            <DeleteConfirmation />
          </SymptomHistoryContext.Provider>
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
