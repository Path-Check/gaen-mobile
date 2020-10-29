import React from "react"
import {
  cleanup,
  fireEvent,
  render,
  waitFor,
} from "@testing-library/react-native"
import { showMessage } from "react-native-flash-message"
import { useNavigation } from "@react-navigation/native"

import { ExposureDatum } from "../../exposure"
import { DateTimeUtils } from "../../utils"
import { factories } from "../../factories"
import { ExposureContext } from "../../ExposureContext"
import { failureResponse } from "../../OperationResponse"

import History from "./index"

jest.mock("react-native-flash-message")
jest.mock("@react-navigation/native")
;(useNavigation as jest.Mock).mockReturnValue({ navigate: jest.fn() })

afterEach(cleanup)
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
      const checkForNewExposuresSpy = jest
        .fn()
        .mockResolvedValueOnce({ kind: "success" })

      const { getByTestId } = render(
        <ExposureContext.Provider
          value={factories.exposureContext.build({
            checkForNewExposures: checkForNewExposuresSpy,
          })}
        >
          <History exposures={exposures} lastDetectionDate={null} />
        </ExposureContext.Provider>,
      )

      fireEvent.press(getByTestId("check-for-exposures-button"))

      await waitFor(() => {
        expect(checkForNewExposuresSpy).toHaveBeenCalled()
      })
    })

    describe("when exposure check returns rate limiting error", () => {
      it("displays a success message", async () => {
        const showMessageSpy = showMessage as jest.Mock
        const checkForNewExposuresSpy = jest.fn().mockResolvedValueOnce({
          kind: "failure",
          error: "ExceededCheckRateLimit",
        })

        const { getByTestId } = render(
          <ExposureContext.Provider
            value={factories.exposureContext.build({
              checkForNewExposures: checkForNewExposuresSpy,
            })}
          >
            <History exposures={[]} lastDetectionDate={null} />
          </ExposureContext.Provider>,
        )

        fireEvent.press(getByTestId("check-for-exposures-button"))

        await waitFor(() => {
          expect(showMessageSpy).toHaveBeenCalledWith(
            expect.objectContaining({
              message: "Success",
            }),
          )
        })
      })
    })

    describe("when exposure check is successful", () => {
      it("displays a success message", async () => {
        const checkForNewExposuresSpy = jest.fn()
        const showMessageSpy = showMessage as jest.Mock

        const { getByTestId } = render(
          <ExposureContext.Provider
            value={factories.exposureContext.build({
              checkForNewExposures: checkForNewExposuresSpy,
            })}
          >
            <History exposures={[]} lastDetectionDate={null} />
          </ExposureContext.Provider>,
        )

        fireEvent.press(getByTestId("check-for-exposures-button"))

        await waitFor(() => {
          expect(showMessageSpy).toHaveBeenCalledWith(
            expect.objectContaining({
              message: "Success",
            }),
          )
        })
      })
    })

    describe("when exposure check is not successful", () => {
      it("displays a failure message", async () => {
        const checkForNewExposuresSpy = jest.fn()
        checkForNewExposuresSpy.mockResolvedValueOnce(failureResponse)
        const showMessageSpy = showMessage as jest.Mock

        const { getByTestId } = render(
          <ExposureContext.Provider
            value={factories.exposureContext.build({
              checkForNewExposures: checkForNewExposuresSpy,
            })}
          >
            <History exposures={[]} lastDetectionDate={null} />
          </ExposureContext.Provider>,
        )

        fireEvent.press(getByTestId("check-for-exposures-button"))

        await waitFor(() => {
          expect(showMessageSpy).toHaveBeenCalledWith(
            expect.objectContaining({
              message: "Something went wrong",
            }),
          )
        })
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
