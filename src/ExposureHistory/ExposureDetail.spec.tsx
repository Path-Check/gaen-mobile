import React from "react"
import { Linking } from "react-native"
import { render, fireEvent } from "@testing-library/react-native"
import { DateTimeUtils } from "../utils"
import { factories } from "../factories"
import ExposureDetail from "./ExposureDetail"
import { useRoute } from "@react-navigation/native"

jest.mock("react-native-config", () => {
  return {
    AUTHORITY_ADVICE_URL: "https://www.health.state.mn.us/",
  }
})

jest.mock("@react-navigation/native")
describe("ExposureDetail", () => {
  describe("when the exposure happened in the last three days", () => {
    it("formats the timeframe correctly", () => {
      const today = DateTimeUtils.beginningOfDay(Date.now())

      const exposureDatum = factories.exposureDatum.build({
        kind: "Possible",
        date: today,
      })
      ;(useRoute as jest.Mock).mockReturnValue({
        params: { exposureDatum },
      })

      const { getByText } = render(<ExposureDetail />)
      expect(getByText("Within the last 3 days")).toBeDefined()
    })
  })

  describe("when the exposure happened four to six days ago", () => {
    it("formats the timeframe correctly ", () => {
      const fourDaysAgo = DateTimeUtils.beginningOfDay(DateTimeUtils.daysAgo(4))
      const exposureDatum = factories.exposureDatum.build({
        kind: "Possible",
        date: fourDaysAgo,
      })

      ;(useRoute as jest.Mock).mockReturnValue({ params: { exposureDatum } })

      const { getByText } = render(<ExposureDetail />)
      expect(getByText("4 to 6 days ago")).toBeDefined()
    })
  })

  describe("when the exposure happened seven to fourteen days ago", () => {
    it("formats the timeframe correctly", () => {
      const sevenDaysAgo = DateTimeUtils.beginningOfDay(
        DateTimeUtils.daysAgo(7),
      )
      const exposureDatum = factories.exposureDatum.build({
        kind: "Possible",
        date: sevenDaysAgo,
      })

      ;(useRoute as jest.Mock).mockReturnValue({ params: { exposureDatum } })

      const { getByText } = render(<ExposureDetail />)
      expect(getByText("7 to 14 days ago")).toBeDefined()
    })
  })

  describe("when the health authority provides a link", () => {
    it("directs the user to the health authority link", () => {
      const openURLSpy = jest.spyOn(Linking, "openURL")
      const { getByText } = render(<ExposureDetail />)
      const nextStepsButton = getByText("Next Steps")
      const authorityAdviceUrl = "https://www.health.state.mn.us/"
      fireEvent.press(nextStepsButton)

      expect(openURLSpy).toHaveBeenCalledWith(authorityAdviceUrl)
    })
  })
})
