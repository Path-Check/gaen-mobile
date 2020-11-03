import React, { useEffect, FunctionComponent, useContext } from "react"
import { Text } from "react-native"
import { render, waitFor } from "@testing-library/react-native"

import { StorageUtils } from "../utils"
import { ConfigurationContext } from "../ConfigurationContext"
import { factories } from "../factories"
import { actions } from "./index"
import { AnalyticsContext, AnalyticsProvider } from "./Context"

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

    describe("when a health authority supports analytics tracking", () => {
      describe("and the user has consented to analytics", () => {
        it("tracks the event", async () => {
          expect.assertions(1)
          const configurationContext = factories.configurationContext.build({
            healthAuthoritySupportsAnalytics: true,
          })
          jest
            .spyOn(StorageUtils, "getAnalyticsConsent")
            .mockResolvedValueOnce(true)
          render(
            <ConfigurationContext.Provider value={configurationContext}>
              <AnalyticsProvider>
                <TrackEvent />
              </AnalyticsProvider>
            </ConfigurationContext.Provider>,
          )

          const trackEventSpy = jest.spyOn(actions, "trackEvent")

          await waitFor(() => {
            expect(trackEventSpy).toHaveBeenCalledWith(SAMPLE_EVENT)
          })
        })
      })

      describe("and the user has not consented to analytics", () => {
        it("does not track the event", () => {
          expect.assertions(1)
          jest
            .spyOn(StorageUtils, "getAnalyticsConsent")
            .mockResolvedValue(false)

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

    describe("when a health authority does not support analytics tracking", () => {
      it("does not tracks the event", async () => {
        expect.assertions(1)
        const configurationContext = factories.configurationContext.build({
          healthAuthoritySupportsAnalytics: false,
        })
        jest
          .spyOn(StorageUtils, "getAnalyticsConsent")
          .mockResolvedValueOnce(true)
        render(
          <ConfigurationContext.Provider value={configurationContext}>
            <AnalyticsProvider>
              <TrackEvent />
            </AnalyticsProvider>
          </ConfigurationContext.Provider>,
        )

        const trackEventSpy = jest.spyOn(actions, "trackEvent")

        await waitFor(() => {
          expect(trackEventSpy).not.toHaveBeenCalled()
        })
      })
    })
  })

  describe("tracking screen views", () => {
    afterEach(() => jest.resetAllMocks())

    describe("when the health authority supports analytics tracking", () => {
      describe("and the user has consented to anonymized data sharing", () => {
        it("tracks the screen view", async () => {
          expect.assertions(1)
          const configurationContext = factories.configurationContext.build({
            healthAuthoritySupportsAnalytics: true,
            healthAuthorityAnalyticsUrl: "http://example.com",
            healthAuthorityAnalyticsSiteId: 12,
          })

          jest
            .spyOn(StorageUtils, "getAnalyticsConsent")
            .mockResolvedValueOnce(true)
          render(
            <ConfigurationContext.Provider value={configurationContext}>
              <AnalyticsProvider>
                <TrackScreenView />
              </AnalyticsProvider>
            </ConfigurationContext.Provider>,
          )

          const trackScreenView = jest.spyOn(actions, "trackScreenView")

          await waitFor(() => {
            expect(trackScreenView).toHaveBeenCalledWith("Home")
          })
        })
      })

      describe("and the user has not consented to anonymized data sharing", () => {
        it("does not track the screen view", async () => {
          expect.assertions(1)
          const configurationContext = factories.configurationContext.build({
            healthAuthoritySupportsAnalytics: true,
            healthAuthorityAnalyticsUrl: "http://example.com",
            healthAuthorityAnalyticsSiteId: 12,
          })

          jest
            .spyOn(StorageUtils, "getAnalyticsConsent")
            .mockResolvedValueOnce(false)
          render(
            <ConfigurationContext.Provider value={configurationContext}>
              <AnalyticsProvider>
                <TrackScreenView />
              </AnalyticsProvider>
            </ConfigurationContext.Provider>,
          )

          const trackScreenView = jest.spyOn(actions, "trackScreenView")

          await waitFor(() => {
            expect(trackScreenView).not.toHaveBeenCalled()
          })
        })
      })
    })

    describe("when the health authority does not support analytics tracking", () => {
      it("does not track the screen view", async () => {
        expect.assertions(1)
        const configurationContext = factories.configurationContext.build({
          healthAuthoritySupportsAnalytics: false,
          healthAuthorityAnalyticsUrl: null,
          healthAuthorityAnalyticsSiteId: null,
        })

        jest
          .spyOn(StorageUtils, "getAnalyticsConsent")
          .mockResolvedValueOnce(false)
        render(
          <ConfigurationContext.Provider value={configurationContext}>
            <AnalyticsProvider>
              <TrackScreenView />
            </AnalyticsProvider>
          </ConfigurationContext.Provider>,
        )

        const trackScreenView = jest.spyOn(actions, "trackScreenView")

        await waitFor(() => {
          expect(trackScreenView).not.toHaveBeenCalled()
        })
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

const TrackScreenView: FunctionComponent = () => {
  const context = useContext(AnalyticsContext)

  useEffect(() => {
    context.trackScreenView("Home")
  }, [context])
  return <Text> User consent status: {context.userConsentedToAnalytics}</Text>
}
