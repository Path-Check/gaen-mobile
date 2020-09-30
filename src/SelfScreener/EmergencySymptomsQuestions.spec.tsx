import React from "react"
import { fireEvent, render } from "@testing-library/react-native"
import { useNavigation } from "@react-navigation/native"

import { SelfScreenerContext } from "../SelfScreenerContext"
import EmergencySymptomsQuestions from "./EmergencySymptomsQuestions"
import { EmergencySymptom } from "./selfScreener"
import { factories } from "../factories"
import { SelfScreenerStackScreens } from "../navigation"

jest.mock("@react-navigation/native")
describe("EmergencySymptomsQuestions", () => {
  it("allows the user to update the symptoms", () => {
    expect.assertions(1)

    const updateSymptomsSpy = jest.fn()
    const context = factories.selfScreenerContext.build({
      updateSymptoms: updateSymptomsSpy,
    })

    const { getByText } = render(
      <SelfScreenerContext.Provider value={context}>
        <EmergencySymptomsQuestions />
      </SelfScreenerContext.Provider>,
    )

    const difficultyBreathingCheckbox = getByText(
      "Extreme difficulty breathing",
    )

    fireEvent.press(difficultyBreathingCheckbox)
    expect(updateSymptomsSpy).toHaveBeenCalledWith(
      EmergencySymptom.SEVERE_DIFFICULTY_BREATHING,
    )
  })

  describe("clicking next", () => {
    describe("when a user has reported experiencing emergency symptoms", () => {
      it("navigates to the CallEmergencyServices screen", () => {
        const navigationSpy = jest.fn()
        ;(useNavigation as jest.Mock).mockReturnValue({
          navigate: navigationSpy,
        })
        const context = factories.selfScreenerContext.build({
          emergencySymptoms: [EmergencySymptom.SEVERE_DIFFICULTY_BREATHING],
        })

        const { getByText } = render(
          <SelfScreenerContext.Provider value={context}>
            <EmergencySymptomsQuestions />
          </SelfScreenerContext.Provider>,
        )

        const nextButton = getByText("Next")

        fireEvent.press(nextButton)
        expect(navigationSpy).toHaveBeenCalledWith(
          SelfScreenerStackScreens.CallEmergencyServices,
        )
      })
    })

    describe("when a user has reported not experiencing any symptoms", () => {
      it("navigates them to the NoEmergencySymptoms screen", () => {
        const navigationSpy = jest.fn()
        ;(useNavigation as jest.Mock).mockReturnValue({
          navigate: navigationSpy,
        })
        const context = factories.selfScreenerContext.build()

        const { getByText } = render(
          <SelfScreenerContext.Provider value={context}>
            <EmergencySymptomsQuestions />
          </SelfScreenerContext.Provider>,
        )

        const nextButton = getByText("Next")

        fireEvent.press(nextButton)
        expect(navigationSpy).toHaveBeenCalledWith(
          SelfScreenerStackScreens.NoEmergencySymptoms,
        )
      })
    })
  })
})
