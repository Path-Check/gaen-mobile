import React from "react"
import { showMessage } from "react-native-flash-message"
import { render, fireEvent, waitFor } from "@testing-library/react-native"
import { useNavigation } from "@react-navigation/native"

import SelectSymptomsScreen from "./SelectSymptoms"
import { MyHealthStackScreens } from "../navigation"
import { SymptomLogContext } from "./SymptomLogContext"
import { factories } from "../factories"

jest.mock("react-native-flash-message")
jest.mock("@react-navigation/native")

describe("SelectSymptomsScreen", () => {
  it("shows a success flash message when symptoms are saved", async () => {
    const showMessageSpy = showMessage as jest.Mock
    const addLogEntrySpy = jest.fn()
    addLogEntrySpy.mockResolvedValueOnce({})
    const navigateSpy = jest.fn()
    ;(useNavigation as jest.Mock).mockReturnValue({ navigate: navigateSpy })
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
