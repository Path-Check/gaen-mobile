import React, { useEffect, FunctionComponent, useContext } from "react"
import { Text } from "react-native"
import { render, waitFor } from "@testing-library/react-native"

import { StorageUtils } from "../utils"
import { ConfigurationContext } from "../ConfigurationContext"
import { factories } from "../factories"
import {
  ProductAnalyticsContext,
  ProductAnalyticsProvider,
  EventAction,
  EventCategory,
} from "./Context"
import * as analyticsClient from "../ProductAnalytics/analyticsClient"

describe("ProductAnalyticsContext", () => {
  describe("getting the current user consent status", () => {
    it("passes down the correct user consent status to its children", async () => {
      expect.assertions(1)

      jest.spyOn(StorageUtils, "getAnalyticsConsent").mockResolvedValue(true)
      const { getByText } = render(
        <ProductAnalyticsProvider>
          <DisplayStatus />
        </ProductAnalyticsProvider>,
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
        <ProductAnalyticsProvider>
          <UpdateConsent />
        </ProductAnalyticsProvider>,
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
          const expectedEvent: Event = {
            category: "product_analytics",
            action: "button_tap",
            name: "event_name",
          }

          render(
            <ConfigurationContext.Provider value={configurationContext}>
              <ProductAnalyticsProvider>
                <TrackEvent event={expectedEvent} />
              </ProductAnalyticsProvider>
            </ConfigurationContext.Provider>,
          )

          const trackEventSpy = jest.spyOn(analyticsClient, "trackEvent")

          await waitFor(() => {
            expect(trackEventSpy).toHaveBeenCalledWith(
              expectedEvent.category,
              expectedEvent.action,
              expectedEvent.name,
            )
          })
        })
      })

      describe("and the user has not consented to analytics", () => {
        it("does not track the event", () => {
          expect.assertions(1)
          jest
            .spyOn(StorageUtils, "getAnalyticsConsent")
            .mockResolvedValue(false)

          const expectedEvent: Event = {
            category: "product_analytics",
            action: "button_tap",
            name: "event_name",
          }

          const trackEventSpy = jest.spyOn(analyticsClient, "trackEvent")

          render(
            <ProductAnalyticsProvider>
              <TrackEvent event={expectedEvent} />
            </ProductAnalyticsProvider>,
          )
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

        const expectedEvent: Event = {
          category: "product_analytics",
          action: "button_tap",
          name: "event_name",
        }

        render(
          <ConfigurationContext.Provider value={configurationContext}>
            <ProductAnalyticsProvider>
              <TrackEvent event={expectedEvent} />
            </ProductAnalyticsProvider>
          </ConfigurationContext.Provider>,
        )

        const trackEventSpy = jest.spyOn(analyticsClient, "trackEvent")

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
              <ProductAnalyticsProvider>
                <TrackScreenView />
              </ProductAnalyticsProvider>
            </ConfigurationContext.Provider>,
          )

          const trackScreenViewSpy = jest.spyOn(
            analyticsClient,
            "trackScreenView",
          )

          await waitFor(() => {
            expect(trackScreenViewSpy).toHaveBeenCalledWith("Home")
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
              <ProductAnalyticsProvider>
                <TrackScreenView />
              </ProductAnalyticsProvider>
            </ConfigurationContext.Provider>,
          )

          const trackEventSpy = jest.spyOn(analyticsClient, "trackEvent")

          await waitFor(() => {
            expect(trackEventSpy).not.toHaveBeenCalled()
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
            <ProductAnalyticsProvider>
              <TrackScreenView />
            </ProductAnalyticsProvider>
          </ConfigurationContext.Provider>,
        )

        const trackEventSpy = jest.spyOn(analyticsClient, "trackEvent")

        await waitFor(() => {
          expect(trackEventSpy).not.toHaveBeenCalled()
        })
      })
    })
  })
})

const DisplayStatus: FunctionComponent = () => {
  const context = useContext(ProductAnalyticsContext)

  return <Text> User consent status: {context.userConsentedToAnalytics}</Text>
}

const UpdateConsent: FunctionComponent = () => {
  const context = useContext(ProductAnalyticsContext)

  useEffect(() => {
    context.updateUserConsent(true)
  }, [context])
  return <Text> User consent status: {context.userConsentedToAnalytics}</Text>
}

type Event = {
  category: EventCategory
  action: EventAction
  name: string
}

const TrackEvent: FunctionComponent<{
  event: Event
}> = ({ event: { category, action, name } }) => {
  const context = useContext(ProductAnalyticsContext)

  useEffect(() => {
    context.trackEvent(category, action, name)
  }, [context])
  return <Text> User consent status: {context.userConsentedToAnalytics}</Text>
}

const TrackScreenView: FunctionComponent = () => {
  const context = useContext(ProductAnalyticsContext)

  useEffect(() => {
    context.trackScreenView("Home")
  }, [context])
  return <Text> User consent status: {context.userConsentedToAnalytics}</Text>
}
