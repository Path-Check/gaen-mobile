import React from "react"
import { fireEvent, render, waitFor } from "@testing-library/react-native"
import { useNavigation } from "@react-navigation/native"

import { ExposureDatum } from "../../exposure"
import { DateTimeUtils } from "../../utils"
import { factories } from "../../factories"
import { ExposureContext } from "../../ExposureContext"

import History from "./index"

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

  describe("when the refresh button is tapped", () => {
    it("checks for new exposures", async () => {
      const exposures: ExposureDatum[] = []
      const checkForNewExposuresSpy = jest.fn()

      const { getByLabelText } = render(
        <ExposureContext.Provider
          value={factories.exposureContext.build({
            checkForNewExposures: checkForNewExposuresSpy,
          })}
        >
          <History exposures={exposures} lastDetectionDate={null} />
        </ExposureContext.Provider>,
      )

      fireEvent.press(getByLabelText("Check for exposures"))

      await waitFor(() => {
        expect(checkForNewExposuresSpy).toHaveBeenCalled()
      })
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
