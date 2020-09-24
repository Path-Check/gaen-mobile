import React from "react"
import { showMessage } from "react-native-flash-message"
import { render, fireEvent, waitFor } from "@testing-library/react-native"
import { useNavigation, useRoute } from "@react-navigation/native"

import SelectSymptomsScreen from "./SelectSymptoms"
import { MyHealthStackScreens } from "../navigation"
import { SymptomLogContext } from "./SymptomLogContext"
import { factories } from "../factories"

jest.mock("react-native-flash-message")
jest.mock("@react-navigation/native")

describe("SelectSymptomsScreen", () => {
  describe("when a symptom log is passed as an argument", () => {
    afterEach(() => {
      jest.resetAllMocks()
    })
    it("updates the symptom log", async () => {
      const showMessageSpy = showMessage as jest.Mock
      const updateLogEntrySpy = jest.fn()
      updateLogEntrySpy.mockResolvedValueOnce({})
      const logEntry = {
        id: "1",
        symptoms: ["cough"],
        date: Date.now(),
      }
      const navigateSpy = jest.fn()
      ;(useNavigation as jest.Mock).mockReturnValue({ navigate: navigateSpy })
      ;(useRoute as jest.Mock).mockReturnValue({
        params: { logEntry: JSON.stringify(logEntry) },
      })

      const { getByLabelText } = render(
        <SymptomLogContext.Provider
          value={factories.symptomLogContext.build({
            updateLogEntry: updateLogEntrySpy,
          })}
        >
          <SelectSymptomsScreen />
        </SymptomLogContext.Provider>,
      )

      fireEvent.press(getByLabelText("Fever"))
      fireEvent.press(getByLabelText("Save"))

      await waitFor(() => {
        expect(updateLogEntrySpy).toHaveBeenCalledWith({
          ...logEntry,
          symptoms: ["cough", "fever"],
        })
        expect(showMessageSpy).toHaveBeenCalledWith(
          expect.objectContaining({
            message: "Symptoms updated!",
          }),
        )
        expect(navigateSpy).toHaveBeenCalledWith(
          MyHealthStackScreens.AtRiskRecommendation,
        )
      })
    })
    it("deletes the symptom log", async () => {
      const showMessageSpy = showMessage as jest.Mock
      const deleteLogEntrySpy = jest.fn()
      deleteLogEntrySpy.mockResolvedValueOnce({})
      const logEntryId = "1"
      const logEntry = {
        id: logEntryId,
        symptoms: ["cough"],
        date: Date.now(),
      }
      const goBackSpy = jest.fn()
      ;(useNavigation as jest.Mock).mockReturnValue({ goBack: goBackSpy })
      ;(useRoute as jest.Mock).mockReturnValue({
        params: { logEntry: JSON.stringify(logEntry) },
      })

      const { getByLabelText } = render(
        <SymptomLogContext.Provider
          value={factories.symptomLogContext.build({
            deleteLogEntry: deleteLogEntrySpy,
          })}
        >
          <SelectSymptomsScreen />
        </SymptomLogContext.Provider>,
      )

      fireEvent.press(getByLabelText("Delete entry"))

      await waitFor(() => {
        expect(deleteLogEntrySpy).toHaveBeenCalledWith(logEntryId)
        expect(showMessageSpy).toHaveBeenCalledWith(
          expect.objectContaining({
            message: "Entry deleted",
          }),
        )
        expect(goBackSpy).toHaveBeenCalled()
      })
    })
  })

  describe("when no symptom log is passed as an argument", () => {
    it("does not display the delete entry button", () => {
      const params = {}
      ;(useRoute as jest.Mock).mockReturnValue({ params })
      ;(useNavigation as jest.Mock).mockReturnValue({})

      const { queryByLabelText } = render(
        <SymptomLogContext.Provider
          value={factories.symptomLogContext.build({})}
        >
          <SelectSymptomsScreen />
        </SymptomLogContext.Provider>,
      )
      expect(queryByLabelText("Delete entry")).toBeNull()
    })
    it("creates a new symptom log", async () => {
      const showMessageSpy = showMessage as jest.Mock
      const addLogEntrySpy = jest.fn()
      addLogEntrySpy.mockResolvedValueOnce({})
      const navigateSpy = jest.fn()
      ;(useNavigation as jest.Mock).mockReturnValue({ navigate: navigateSpy })
      ;(useRoute as jest.Mock).mockReturnValue({ params: {} })
      const coughSymptom = "cough"

      const { getByLabelText } = render(
        <SymptomLogContext.Provider
          value={factories.symptomLogContext.build({
            addLogEntry: addLogEntrySpy,
          })}
        >
          <SelectSymptomsScreen />
        </SymptomLogContext.Provider>,
      )

      fireEvent.press(getByLabelText("Cough"))
      fireEvent.press(getByLabelText("Save"))

      await waitFor(() => {
        expect(addLogEntrySpy).toHaveBeenCalledWith([coughSymptom])
        expect(showMessageSpy).toHaveBeenCalledWith(
          expect.objectContaining({
            message: "Symptoms saved!",
          }),
        )
        expect(navigateSpy).toHaveBeenCalledWith(
          MyHealthStackScreens.AtRiskRecommendation,
        )
      })
    })
  })
})
