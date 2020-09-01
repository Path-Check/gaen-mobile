import React from "react"
import { render } from "@testing-library/react-native"
import { useNavigation } from "@react-navigation/native"
import { useSafeAreaInsets } from "react-native-safe-area-context"

import { ExposureDatum } from "../../exposure"
import { DateTimeUtils } from "../../utils"
import { factories } from "../../factories"

import History from "."

jest.mock("react-native-safe-area-context")
;(useSafeAreaInsets as jest.Mock).mockReturnValue({ insets: { bottom: 0 } })

jest.mock("@react-navigation/native")
;(useNavigation as jest.Mock).mockReturnValue({ navigate: jest.fn() })

describe("History", () => {
  describe("when there are no exposures", () => {
    it("shows a no exposure reports message", () => {
      const exposures: ExposureDatum[] = []

      const { queryByText } = render(
        <History exposures={exposures} lastDetectionDate={null} />,
      )

      expect(queryByText("No Exposure Reports")).not.toBeNull()
    })
  })

  describe("when given an exposure history that has a possible exposure", () => {
    it("shows a list of the exposures", async () => {
      const twoDaysAgo = DateTimeUtils.beginningOfDay(DateTimeUtils.daysAgo(2))
      const datum1 = factories.exposureDatum.build({
        date: twoDaysAgo,
      })

      const exposures = [datum1]

      const { getByTestId } = render(
        <History exposures={exposures} lastDetectionDate={null} />,
      )

      expect(getByTestId("exposure-list")).toBeDefined()
    })
  })
})
