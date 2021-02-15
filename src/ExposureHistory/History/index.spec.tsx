import React from "react"
import { Alert } from "react-native"
import {
  cleanup,
  fireEvent,
  render,
  waitFor,
} from "@testing-library/react-native"
import { useNavigation } from "@react-navigation/native"

import { ExposureDatum } from "../../exposure"
import { DateTimeUtils } from "../../utils"
import { factories } from "../../factories"
import { ExposureContext } from "../../ExposureContext"
import * as NativeModule from "../../gaen/nativeModule"
import { PermissionsContext } from "../../Device/PermissionsContext"

import History from "./index"

jest.mock("react-native-flash-message")
jest.mock("@react-navigation/native")
;(useNavigation as jest.Mock).mockReturnValue({ navigate: jest.fn() })

afterEach(cleanup)

describe("History", () => {
  afterEach(() => {
    jest.resetAllMocks()
  })

  describe("when there are no exposures", () => {
    it("shows a no exposure reports message", () => {
      const exposures: ExposureDatum[] = []

      const { queryByText } = render(
        <History exposures={exposures} lastDetectionDate={null} />,
      )

      expect(queryByText("No Exposure Reports")).not.toBeNull()
    })
  })

  describe("when the check for exposures button is tapped", () => {
    describe("and exposure notifications are not active", () => {
      it("displays a can't check for exposures message", async () => {
        const alertSpy = jest.fn()
        Alert.alert = alertSpy

        const { getByTestId } = render(
          <PermissionsContext.Provider
            value={factories.permissionsContext.build({
              exposureNotifications: { status: "Disabled" },
            })}
          >
            <History exposures={[]} lastDetectionDate={null} />
          </PermissionsContext.Provider>,
        )

        fireEvent.press(getByTestId("check-for-exposures-button"))

        await waitFor(() => {
          expect(alertSpy).toHaveBeenCalledWith(
            "Can't Check for Exposures",
            "You must enable Exposure Notifications to check for exposures.",
            [
              expect.objectContaining({ text: "Back" }),
              expect.objectContaining({
                text: "Enable Exposure Notifications",
              }),
            ],
          )
        })
      })
    })

    describe("and exposure notifications are active", () => {
      it("checks for new exposures", async () => {
        const exposures: ExposureDatum[] = []
        const checkForNewExposuresSpy = jest
          .fn()
          .mockResolvedValueOnce({ kind: "success" })

        const { getByTestId } = render(
          <PermissionsContext.Provider
            value={factories.permissionsContext.build({
              exposureNotifications: { status: "Active" },
            })}
          >
            <ExposureContext.Provider
              value={factories.exposureContext.build({
                detectExposures: checkForNewExposuresSpy,
              })}
            >
              <History exposures={exposures} lastDetectionDate={null} />
            </ExposureContext.Provider>
          </PermissionsContext.Provider>,
        )

        fireEvent.press(getByTestId("check-for-exposures-button"))

        await waitFor(() => {
          expect(checkForNewExposuresSpy).toHaveBeenCalled()
        })
      })

      describe("when exposure check returns rate limiting error", () => {
        it("displays a success message", async () => {
          const alertSpy = jest.fn()
          Alert.alert = alertSpy
          const response: NativeModule.DetectExposuresResponse = {
            kind: "failure",
            error: "RateLimited",
          }
          const checkForNewExposuresSpy = jest
            .fn()
            .mockResolvedValueOnce(response)

          const { getByTestId } = render(
            <PermissionsContext.Provider
              value={factories.permissionsContext.build({
                exposureNotifications: { status: "Active" },
              })}
            >
              <ExposureContext.Provider
                value={factories.exposureContext.build({
                  detectExposures: checkForNewExposuresSpy,
                })}
              >
                <History exposures={[]} lastDetectionDate={null} />
              </ExposureContext.Provider>
            </PermissionsContext.Provider>,
          )

          fireEvent.press(getByTestId("check-for-exposures-button"))

          await waitFor(() => {
            expect(alertSpy).toHaveBeenCalledWith(
              "Exposure check complete",
              "",
              [{ text: "Ok" }],
            )
          })
        })
      })

      describe("when exposure check is successful", () => {
        it("displays a success message", async () => {
          const checkForNewExposuresSpy = jest.fn()
          const response: NativeModule.DetectExposuresResponse = {
            kind: "success",
          }
          checkForNewExposuresSpy.mockResolvedValueOnce(response)
          const alertSpy = jest.fn()
          Alert.alert = alertSpy

          const { getByTestId } = render(
            <PermissionsContext.Provider
              value={factories.permissionsContext.build({
                exposureNotifications: { status: "Active" },
              })}
            >
              <ExposureContext.Provider
                value={factories.exposureContext.build({
                  detectExposures: checkForNewExposuresSpy,
                })}
              >
                <History exposures={[]} lastDetectionDate={null} />
              </ExposureContext.Provider>
            </PermissionsContext.Provider>,
          )

          fireEvent.press(getByTestId("check-for-exposures-button"))

          await waitFor(() => {
            expect(alertSpy).toHaveBeenCalledWith(
              "Exposure check complete",
              "",
              [{ text: "Ok" }],
            )
          })
        })
      })

      describe("when exposure check is not successful", () => {
        it("displays a failure message", async () => {
          const checkForNewExposuresSpy = jest.fn()
          const response: NativeModule.DetectExposuresResponse = {
            kind: "failure",
            error: "Unknown",
          }
          checkForNewExposuresSpy.mockResolvedValueOnce(response)
          const alertSpy = jest.fn()
          Alert.alert = alertSpy

          const { getByTestId } = render(
            <PermissionsContext.Provider
              value={factories.permissionsContext.build({
                exposureNotifications: { status: "Active" },
              })}
            >
              <ExposureContext.Provider
                value={factories.exposureContext.build({
                  detectExposures: checkForNewExposuresSpy,
                })}
              >
                <History exposures={[]} lastDetectionDate={null} />
              </ExposureContext.Provider>
            </PermissionsContext.Provider>,
          )

          fireEvent.press(getByTestId("check-for-exposures-button"))

          await waitFor(() => {
            expect(alertSpy).toHaveBeenCalledWith(
              "Something Went Wrong",
              "Something unexpected happened. Please close and reopen the app and try again.",
              [{ text: "Ok" }],
            )
          })
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
