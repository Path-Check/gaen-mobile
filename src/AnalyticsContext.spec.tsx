import React, { useEffect, FunctionComponent, useContext } from "react"
import { Text } from "react-native"
import { AnalyticsContext, AnalyticsProvider } from "./AnalyticsContext"
import { render, waitFor } from "@testing-library/react-native"
import { actions } from "./analytics"
import { StorageUtils } from "./utils"

const SAMPLE_EVENT = "SAMPLE_EVENT"
describe("AnalyticsContext", () => {
  describe("getting the current user consent status", () => {
    it("passes down the correct user consent status to its children", async () => {
      expect.assertions(1)

      jest.spyOn(StorageUtils, "getAnalyticsConsent").mockResolvedValue(true)
      const { getByText } = render(
        <AnalyticsProvider>
          <DisplayStatus />
        </AnalyticsProvider>,
      )

      await waitFor(() => {
        expect(getByText(/User consent status:/)).toHaveTextContent("true")
      })
    })
  })

  describe("updating the user consent status", () => {
    it("passes down the new consent status to its children", async () => {
      expect.assertions(1)
      jest
        .spyOn(StorageUtils, "getAnalyticsConsent")
        .mockResolvedValueOnce(false)
        .mockResolvedValueOnce(true)

      jest.spyOn(StorageUtils, "setAnalyticsConsent")

      const { getByText } = render(
        <AnalyticsProvider>
          <UpdateConsent />
        </AnalyticsProvider>,
      )

      await waitFor(() => {
        expect(getByText(/User consent status:/)).toHaveTextContent("true")
      })
    })
  })

  describe("tracking events", () => {
    afterEach(() => jest.resetAllMocks())

    describe("when a user has consented to analytics", () => {
      it("tracks the event", async () => {
        expect.assertions(1)
        jest
          .spyOn(StorageUtils, "getAnalyticsConsent")
          .mockResolvedValueOnce(true)
        render(
          <AnalyticsProvider>
            <TrackEvent />
          </AnalyticsProvider>,
        )

        const trackEventSpy = jest.spyOn(actions, "trackEvent")

        await waitFor(() => {
          expect(trackEventSpy).toHaveBeenCalledWith(SAMPLE_EVENT)
        })
      })
    })

    describe("when a user has not consented to analytics", () => {
      it("does not track the event", () => {
        expect.assertions(1)
        jest.spyOn(StorageUtils, "getAnalyticsConsent").mockResolvedValue(false)

        render(
          <AnalyticsProvider>
            <TrackEvent />
          </AnalyticsProvider>,
        )
        const trackEventSpy = jest.spyOn(actions, "trackEvent")

        expect(trackEventSpy).not.toHaveBeenCalled()
      })
    })
  })
})

const DisplayStatus: FunctionComponent = () => {
  const context = useContext(AnalyticsContext)

  return <Text> User consent status: {context.userConsentedToAnalytics}</Text>
}

const UpdateConsent: FunctionComponent = () => {
  const context = useContext(AnalyticsContext)

  useEffect(() => {
    context.updateUserConsent(true)
  }, [context])
  return <Text> User consent status: {context.userConsentedToAnalytics}</Text>
}

const TrackEvent: FunctionComponent = () => {
  const context = useContext(AnalyticsContext)

  useEffect(() => {
    context.trackEvent(SAMPLE_EVENT)
  }, [context])
  return <Text> User consent status: {context.userConsentedToAnalytics}</Text>
}
