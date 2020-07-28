import React from "react"
import { render } from "@testing-library/react-native"
import { useNavigation } from "@react-navigation/native"

import { ExposureDatum } from "../exposure"
import { DateTimeUtils } from "../utils"
import { factories } from "../factories"

import History from "./History"

jest.mock("@react-navigation/native")
;(useNavigation as jest.Mock).mockReturnValue({ navigate: jest.fn() })

describe("History", () => {
  describe("when there are no exposures", () => {
    it("shows a no exposures reports message", () => {
      const exposures: ExposureDatum[] = []

      const { getByText } = render(
        <History exposures={exposures} lastDetectionDate={null} />,
      )

      expect(getByText("No Exposure Reports")).not.toBeNull()
    })
  })

  describe("when given an exposure history that has a possible exposure", () => {
    it("shows a list of the exposures", async () => {
      const twoDaysAgo = DateTimeUtils.beginningOfDay(DateTimeUtils.daysAgo(2))
      const datum1 = factories.exposureDatum.build({
        kind: "Possible",
        date: twoDaysAgo,
      })

      const exposures = [datum1]

      const { getByTestId } = render(
        <History exposures={exposures} lastDetectionDate={null} />,
      )

      expect(getByTestId("exposure-list")).not.toBeNull()
    })
  })
})
