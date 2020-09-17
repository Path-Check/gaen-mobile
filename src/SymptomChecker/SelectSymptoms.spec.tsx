import React from "react"
import { showMessage } from "react-native-flash-message"
import { render, fireEvent, waitFor } from "@testing-library/react-native"
import { useNavigation } from "@react-navigation/native"

import SelectSymptomsScreen from "./SelectSymptoms"
import { SymptomCheckerContext } from "./SymptomCheckerContext"
import { HealthAssessment } from "./symptoms"
import { SymptomCheckerStackScreens } from "../navigation"

jest.mock("react-native-flash-message")
jest.mock("@react-navigation/native")

describe("SelectSymptomsScreen", () => {
  it("shows a success flash message when symptoms are saved", async () => {
    const showMessageSpy = showMessage as jest.Mock
    const updateSymptomsSpy = jest.fn()
    const navigateSpy = jest.fn()
    ;(useNavigation as jest.Mock).mockReturnValue({ navigate: navigateSpy })

    const { getByLabelText } = render(
      <SymptomCheckerContext.Provider
        value={{
          updateSymptoms: updateSymptomsSpy,
          symptoms: [],
          healthAssessment: HealthAssessment.NotAtRisk,
        }}
      >
        <SelectSymptomsScreen />
      </SymptomCheckerContext.Provider>,
    )

    fireEvent.press(getByLabelText("Cough"))
    fireEvent.press(getByLabelText("Save"))

    await waitFor(() => {
      expect(showMessageSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          message: "Symptoms saved!",
        }),
      )
      expect(navigateSpy).toHaveBeenCalledWith(
        SymptomCheckerStackScreens.AtRiskRecommendation,
      )
    })
  })
})
