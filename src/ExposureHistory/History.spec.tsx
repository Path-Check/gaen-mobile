import React from "react"
import { fireEvent, wait, cleanup, render } from "@testing-library/react-native"
import { useNavigation } from "@react-navigation/native"

import { toExposureHistory } from "./exposureHistory"
import { DateTimeUtils } from "../utils"
import { factories } from "../factories"

import History from "./History"

const CALENDAR_LENGTH = 21

afterEach(cleanup)
jest.mock("@react-navigation/native")
;(useNavigation as jest.Mock).mockReturnValue({ navigate: jest.fn() })

describe("History", () => {
  it("renders", () => {
    const exposureHistory = buildBlankExposureHistory()

    const { getByTestId } = render(
      <History exposureHistory={exposureHistory} lastDetectionDate={null} />,
    )

    expect(getByTestId("exposure-history-calendar")).not.toBeNull()
  })

  describe("when given an exposure history that has a possible exposure", () => {
    describe("and the user taps the date of that exposure", () => {
      it("shows a 'Next Steps' button", async () => {
        const twoDaysAgo = DateTimeUtils.beginningOfDay(
          DateTimeUtils.daysAgo(2),
        )
        const datum = factories.exposureDatum.build({
          kind: "Possible",
          date: twoDaysAgo,
        })
        const exposureInfo = {
          [datum.date]: datum,
        }
        const exposureHistory = toExposureHistory(exposureInfo, CALENDAR_LENGTH)

        const { queryByTestId, getByTestId } = render(
          <History
            exposureHistory={exposureHistory}
            lastDetectionDate={null}
          />,
        )

        const twoDaysAgoIndicator = getByTestId(`calendar-day-${twoDaysAgo}`)

        expect(queryByTestId("exposure-history-next-steps-button")).toBeNull()

        fireEvent.press(twoDaysAgoIndicator)

        await wait(() => {
          expect(
            getByTestId("exposure-history-next-steps-button"),
          ).not.toBeNull()
        })
      })
    })
  })
})

const buildBlankExposureHistory = () => {
  const datum = factories.exposureDatum.build()
  const exposureInfo = {
    [datum.date]: datum,
  }
  return toExposureHistory(exposureInfo, CALENDAR_LENGTH)
}
