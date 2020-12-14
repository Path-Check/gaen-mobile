import React from "react"
import { Linking } from "react-native"
import { render, fireEvent } from "@testing-library/react-native"
import { useRoute, useNavigation } from "@react-navigation/native"

import { factories } from "../factories"
import ExposureDetail from "./ExposureDetail"
import { ConfigurationContext } from "../ConfigurationContext"
import { ModalStackScreens } from "../navigation"

jest.mock("@react-navigation/native")
describe("ExposureDetail", () => {
  describe("when the exposure happened in the last three days", () => {
    it("formats the timeframe correctly", () => {
      const exposureDatum = factories.exposureDatum.build({
        date: 1607973708673,
      })
      ;(useRoute as jest.Mock).mockReturnValue({
        params: { exposureDatum },
      })

      const { getByText } = render(<ExposureDetail />)
      expect(getByText("Sunday, Dec 13th - Tuesday, Dec 15th")).toBeDefined()
    })
  })

  describe("when the health authority provides a link", () => {
    it("directs the user to the health authority link", () => {
      const healthAuthorityAdviceUrl = "https://www.health.state.mn.us/"
      const openURLSpy = jest.spyOn(Linking, "openURL")
      const { getByLabelText } = render(
        <ConfigurationContext.Provider
          value={factories.configurationContext.build({
            healthAuthorityAdviceUrl,
          })}
        >
          <ExposureDetail />
        </ConfigurationContext.Provider>,
      )
      const nextStepsButton = getByLabelText("Next steps")
      fireEvent.press(nextStepsButton)

      expect(openURLSpy).toHaveBeenCalledWith(healthAuthorityAdviceUrl)
    })
  })

  describe("when the health authority does not provide a link", () => {
    it("does not displays the next steps link", () => {
      const healthAuthorityAdviceUrl = ""
      const { queryByLabelText } = render(
        <ConfigurationContext.Provider
          value={factories.configurationContext.build({
            healthAuthorityAdviceUrl,
          })}
        >
          <ExposureDetail />
        </ConfigurationContext.Provider>,
      )
      expect(queryByLabelText("Next Steps")).toBeNull()
    })
  })

  describe("when the health authority does not have a callback form", () => {
    it("only shows the guidance information", () => {
      const { getByText, queryByLabelText } = render(
        <ConfigurationContext.Provider
          value={factories.configurationContext.build({
            displayCallbackForm: false,
          })}
        >
          <ExposureDetail />
        </ConfigurationContext.Provider>,
      )

      expect(queryByLabelText("Speak with a contact tracer")).toBeNull()
      expect(getByText("General Guidance")).toBeDefined()
    })
  })

  describe("when the health authority has a callback form", () => {
    it("shows info about what to do next and general guidance", () => {
      const { queryByText } = render(
        <ConfigurationContext.Provider
          value={factories.configurationContext.build({
            displayCallbackForm: true,
          })}
        >
          <ExposureDetail />
        </ConfigurationContext.Provider>,
      )

      expect(
        queryByText(
          `Schedule a call to get support from a contact tracer from the`,
        ),
      ).toBeDefined()
      expect(queryByText("General Guidance")).not.toBeNull()
    })
  })

  describe("when the health authority supports the self assessment", () => {
    it("prompts the user to get personalized guidance", () => {
      const navigateSpy = jest.fn()
      ;(useNavigation as jest.Mock).mockReturnValue({ navigate: navigateSpy })
      const { getByLabelText } = render(
        <ConfigurationContext.Provider
          value={factories.configurationContext.build({
            displaySelfAssessment: true,
          })}
        >
          <ExposureDetail />
        </ConfigurationContext.Provider>,
      )

      const selfAssessmentButton = getByLabelText("Personalize my guidance")

      expect(selfAssessmentButton).not.toBeNull()
      fireEvent.press(selfAssessmentButton)
      expect(navigateSpy).toHaveBeenCalledWith(
        ModalStackScreens.SelfAssessmentFromExposureDetails,
      )
    })
  })
})
