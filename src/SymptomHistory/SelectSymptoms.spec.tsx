import React from "react"
import { showMessage } from "react-native-flash-message"
import { render, fireEvent, waitFor } from "@testing-library/react-native"

import { SelectSymptomsForm } from "./SelectSymptoms"
import { SymptomEntry } from "./symptomHistory"
import { Symptom } from "./symptom"
import { SymptomHistoryContext } from "./SymptomHistoryContext"
import { factories } from "../factories"

jest.mock("react-native-flash-message")
jest.mock("@react-navigation/native")

describe("SelectSymptomsForm", () => {
  afterEach(() => {
    jest.resetAllMocks()
  })

  describe("when the user changes the symptoms and taps save", () => {
    it("invokes the update function on the context with the correct symptoms", async () => {
      const updateEntrySpy = jest.fn()
      updateEntrySpy.mockResolvedValueOnce({ kind: "success" })
      const testId = "1"
      const date = Date.now()
      const entry: SymptomEntry = {
        id: testId,
        kind: "UserInput",
        symptoms: new Set<Symptom>(["cough"]),
        date,
      }
      const { getByLabelText, getByTestId } = render(
        <SymptomHistoryContext.Provider
          value={factories.symptomHistoryContext.build({
            updateEntry: updateEntrySpy,
          })}
        >
          <SelectSymptomsForm entry={entry} />
        </SymptomHistoryContext.Provider>,
      )

      fireEvent.press(getByLabelText("Fever"))
      fireEvent.press(getByTestId("select-symptoms-save"))

      const expectedSymptoms = new Set<Symptom>(["cough", "fever"])
      await waitFor(() => {
        expect(updateEntrySpy).toHaveBeenCalledWith(entry, expectedSymptoms)
      })
    })

    it("shows an error message if updating the symptom log fails", async () => {
      const showMessageSpy = showMessage as jest.Mock
      const updateEntrySpy = jest.fn()
      updateEntrySpy.mockResolvedValueOnce({ kind: "failure" })
      const entry: SymptomEntry = {
        id: "1",
        kind: "UserInput",
        symptoms: new Set(["cough"]),
        date: Date.now(),
      }

      const { getByLabelText, getByTestId } = render(
        <SymptomHistoryContext.Provider
          value={factories.symptomHistoryContext.build({
            updateEntry: updateEntrySpy,
          })}
        >
          <SelectSymptomsForm entry={entry} />
        </SymptomHistoryContext.Provider>,
      )

      fireEvent.press(getByLabelText("Fever"))
      fireEvent.press(getByTestId("select-symptoms-save"))

      await waitFor(() => {
        expect(showMessageSpy).toHaveBeenCalledWith(
          expect.objectContaining({
            message: "Sorry, we could not update your symptoms",
          }),
        )
      })
    })
  })
})
