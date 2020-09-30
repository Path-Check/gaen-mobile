import React from "react"
import { render } from "@testing-library/react-native"
import { SelfScreenerContext } from "../SelfScreenerContext"
import Guidance from "./Guidance"
import { factories } from "../factories"
import { SymptomGroup } from "./selfScreener"

describe("Guidance", () => {
  it("displays the appropriate heading for primary 1 symptoms", () => {
    const context = factories.selfScreenerContext.build({
      symptomGroup: SymptomGroup.PRIMARY_1,
    })
    const { queryByText } = render(
      <SelfScreenerContext.Provider value={context}>
        <Guidance />
      </SelfScreenerContext.Provider>,
    )

    expect(
      queryByText(/You also have medical conditions that may put you at risk/),
    ).not.toBeNull()
  })

  it("displays the appropriate heading for primary 2 symptoms", () => {
    const context = factories.selfScreenerContext.build({
      symptomGroup: SymptomGroup.PRIMARY_2,
    })
    const { queryByText } = render(
      <SelfScreenerContext.Provider value={context}>
        <Guidance />
      </SelfScreenerContext.Provider>,
    )

    expect(
      queryByText(/Your symptoms may be related to COVID-19/),
    ).not.toBeNull()
    expect(queryByText(/You also have medical conditions/)).toBeNull()
  })

  it("displays the appropriate heading for non covid symptoms", () => {
    const context = factories.selfScreenerContext.build({
      symptomGroup: SymptomGroup.NON_COVID,
    })
    const { queryByText } = render(
      <SelfScreenerContext.Provider value={context}>
        <Guidance />
      </SelfScreenerContext.Provider>,
    )

    expect(queryByText(/Stay at home and monitor your symptoms/)).not.toBeNull()
    expect(queryByText(/Your symptoms may be related to COVID-19/)).toBeNull()
  })

  it("displays the appropriate heading for no symptoms", () => {
    const context = factories.selfScreenerContext.build({
      symptomGroup: SymptomGroup.ASYMPTOMATIC,
    })
    const { queryByText } = render(
      <SelfScreenerContext.Provider value={context}>
        <Guidance />
      </SelfScreenerContext.Provider>,
    )

    expect(queryByText(/Good to hear you’re feeling fine./)).not.toBeNull()
    expect(queryByText(/Your symptoms may be related to COVID-19/)).toBeNull()
  })

  describe("displaying instructions", () => {
    it("displays the appropriate instructions for primary 1 symptoms", () => {
      const context = factories.selfScreenerContext.build({
        symptomGroup: SymptomGroup.PRIMARY_1,
      })
      const { queryByText } = render(
        <SelfScreenerContext.Provider value={context}>
          <Guidance />
        </SelfScreenerContext.Provider>,
      )

      const callYourDoctorSoon =
        "Call your healthcare provider, clinician advice line, or telemedicine provider within 24 hours."
      expect(queryByText(callYourDoctorSoon)).not.toBeNull()
    })

    it("displays the appropriate instructions for secondary 1 symptoms", () => {
      const context = factories.selfScreenerContext.build({
        symptomGroup: SymptomGroup.SECONDARY_1,
      })
      const { queryByText } = render(
        <SelfScreenerContext.Provider value={context}>
          <Guidance />
        </SelfScreenerContext.Provider>,
      )

      const stayAtHome = "Stay at home except to get medical care."
      expect(queryByText(stayAtHome)).not.toBeNull()
    })

    it("displays the appropriate instructions for non covid symptoms", () => {
      const context = factories.selfScreenerContext.build({
        symptomGroup: SymptomGroup.NON_COVID,
      })
      const { queryByText } = render(
        <SelfScreenerContext.Provider value={context}>
          <Guidance />
        </SelfScreenerContext.Provider>,
      )

      const stayAtHome = /if you get worse symptoms, stay at home/
      expect(queryByText(stayAtHome)).not.toBeNull()
    })

    it("displays the appropriate instructions for no symptoms", () => {
      const context = factories.selfScreenerContext.build({
        symptomGroup: SymptomGroup.ASYMPTOMATIC,
      })
      const { queryByText } = render(
        <SelfScreenerContext.Provider value={context}>
          <Guidance />
        </SelfScreenerContext.Provider>,
      )

      const stayAtHome = /Stay home for 14 days/
      expect(queryByText(stayAtHome)).not.toBeNull()
    })
  })
})
