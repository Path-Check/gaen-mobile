import React from "react"
import { useNavigation } from "@react-navigation/native"
import { fireEvent, render } from "@testing-library/react-native"

import { SelfAssessmentContext } from "../SelfAssessmentContext"
import Guidance from "./Guidance"
import { factories } from "../factories"
import { SymptomGroup } from "./selfAssessment"

jest.mock("@react-navigation/native")
;(useNavigation as jest.Mock).mockReturnValue({ navigate: jest.fn() })

describe("Guidance", () => {
  it("displays the appropriate heading for primary 1 symptoms", () => {
    const context = factories.selfAssessmentContext.build({
      symptomGroup: SymptomGroup.PRIMARY_1,
    })
    const { queryByText } = render(
      <SelfAssessmentContext.Provider value={context}>
        <Guidance />
      </SelfAssessmentContext.Provider>,
    )

    expect(
      queryByText(/You also have medical conditions that may put you at risk/),
    ).not.toBeNull()
  })

  it("displays the appropriate heading for primary 2 symptoms", () => {
    const context = factories.selfAssessmentContext.build({
      symptomGroup: SymptomGroup.PRIMARY_2,
    })
    const { queryByText } = render(
      <SelfAssessmentContext.Provider value={context}>
        <Guidance />
      </SelfAssessmentContext.Provider>,
    )

    expect(
      queryByText(/Your symptoms may be related to COVID-19/),
    ).not.toBeNull()
    expect(queryByText(/You also have medical conditions/)).toBeNull()
  })

  it("displays the appropriate heading for non covid symptoms", () => {
    const context = factories.selfAssessmentContext.build({
      symptomGroup: SymptomGroup.NON_COVID,
    })
    const { queryByText } = render(
      <SelfAssessmentContext.Provider value={context}>
        <Guidance />
      </SelfAssessmentContext.Provider>,
    )

    expect(queryByText(/Stay at home and monitor your symptoms/)).not.toBeNull()
    expect(queryByText(/Your symptoms may be related to COVID-19/)).toBeNull()
  })

  it("displays the appropriate heading for no symptoms", () => {
    const context = factories.selfAssessmentContext.build({
      symptomGroup: SymptomGroup.ASYMPTOMATIC,
    })
    const { queryByText } = render(
      <SelfAssessmentContext.Provider value={context}>
        <Guidance />
      </SelfAssessmentContext.Provider>,
    )

    expect(queryByText(/Good to hear you’re feeling fine./)).not.toBeNull()
    expect(queryByText(/Your symptoms may be related to COVID-19/)).toBeNull()
  })

  it("allows the user to navigate back to the exposure history screen", () => {
    const navigateSpy = jest.fn()
    ;(useNavigation as jest.Mock).mockReturnValue({ navigate: navigateSpy })
    const context = factories.selfAssessmentContext.build({
      symptomGroup: SymptomGroup.ASYMPTOMATIC,
    })
    const { getByLabelText } = render(
      <SelfAssessmentContext.Provider value={context}>
        <Guidance />
      </SelfAssessmentContext.Provider>,
    )

    fireEvent.press(getByLabelText("Done"))
    expect(navigateSpy).toHaveBeenCalledWith("ExposureHistoryFlow")
  })

  describe("displaying instructions", () => {
    it("displays the appropriate instructions for primary 1 symptoms", () => {
      const context = factories.selfAssessmentContext.build({
        symptomGroup: SymptomGroup.PRIMARY_1,
      })
      const { queryByText } = render(
        <SelfAssessmentContext.Provider value={context}>
          <Guidance />
        </SelfAssessmentContext.Provider>,
      )

      const callYourDoctorSoon =
        "Call your healthcare provider, clinician advice line, or telemedicine provider within 24 hours."
      expect(queryByText(callYourDoctorSoon)).not.toBeNull()
    })

    it("displays the appropriate instructions for secondary 1 symptoms", () => {
      const context = factories.selfAssessmentContext.build({
        symptomGroup: SymptomGroup.SECONDARY_1,
      })
      const { queryByText } = render(
        <SelfAssessmentContext.Provider value={context}>
          <Guidance />
        </SelfAssessmentContext.Provider>,
      )

      const stayAtHome = "Stay at home except to get medical care."
      expect(queryByText(stayAtHome)).not.toBeNull()
    })

    it("displays the appropriate instructions for non covid symptoms", () => {
      const context = factories.selfAssessmentContext.build({
        symptomGroup: SymptomGroup.NON_COVID,
      })
      const { queryByText } = render(
        <SelfAssessmentContext.Provider value={context}>
          <Guidance />
        </SelfAssessmentContext.Provider>,
      )

      const stayAtHome = /if you get worse symptoms, stay at home/
      expect(queryByText(stayAtHome)).not.toBeNull()
    })

    it("displays the appropriate instructions for no symptoms", () => {
      const context = factories.selfAssessmentContext.build({
        symptomGroup: SymptomGroup.ASYMPTOMATIC,
      })
      const { queryByText } = render(
        <SelfAssessmentContext.Provider value={context}>
          <Guidance />
        </SelfAssessmentContext.Provider>,
      )

      const stayAtHome = /Stay home for 14 days/
      expect(queryByText(stayAtHome)).not.toBeNull()
    })
  })
})
