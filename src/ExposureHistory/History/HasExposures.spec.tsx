import React from "react"
import { render } from "@testing-library/react-native"
import { useNavigation } from "@react-navigation/native"

import { DateTimeUtils } from "../../utils"
import { factories } from "../../factories"

import HasExposures from "./HasExposures"

jest.mock("@react-navigation/native")
;(useNavigation as jest.Mock).mockReturnValue({ navigate: jest.fn() })

describe("ExposureList", () => {
  describe("when given an exposure history that has possible exposures", () => {
    it("shows a list of the exposures", async () => {
      const twoDaysAgo = DateTimeUtils.beginningOfDay(DateTimeUtils.daysAgo(2))
      const fiveDaysAgo = DateTimeUtils.beginningOfDay(DateTimeUtils.daysAgo(5))
      const sevenDaysAgo = DateTimeUtils.beginningOfDay(
        DateTimeUtils.daysAgo(7),
      )

      const datum1 = factories.exposureDatum.build({
        date: twoDaysAgo,
      })

      const datum2 = factories.exposureDatum.build({
        date: fiveDaysAgo,
      })

      const datum3 = factories.exposureDatum.build({
        date: sevenDaysAgo,
      })

      const exposures = [datum1, datum2, datum3]

      const { getAllByTestId, queryByText } = render(
        <HasExposures exposures={exposures} />,
      )

      expect(queryByText("No Exposure Reports")).toBeNull()
      expect(getAllByTestId("exposure-list-item").length).toEqual(3)
    })
  })
})
