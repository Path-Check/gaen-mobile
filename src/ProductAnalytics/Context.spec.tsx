import React, { useEffect, FunctionComponent, useContext } from "react"
import { Text } from "react-native"
import { render, waitFor } from "@testing-library/react-native"

import { StorageUtils } from "../utils"
import {
  ProductAnalyticsContext,
  ProductAnalyticsProvider,
  EventCategory,
  ProductAnalyticsClient,
} from "./Context"

describe("ProductAnalyticsContext", () => {
  afterEach(() => jest.resetAllMocks())
  describe("When the user has consented to analytics", () => {
    describe("and trackEvent is called", () => {
      it("tracks the event", async () => {
        expect.assertions(1)
        jest
          .spyOn(StorageUtils, "getAnalyticsConsent")
          .mockResolvedValueOnce(true)
        const expectedEvent: Event = {
          category: "product_analytics",
          action: "event_action",
          name: "event_name",
          value: 1,
        }

        const analyticsClient = testAnalyticsClient()

        render(
          <ProductAnalyticsProvider productAnalyticsClient={analyticsClient}>
            <TrackEvent event={expectedEvent} />
          </ProductAnalyticsProvider>,
        )

        const trackEventSpy = jest.spyOn(analyticsClient, "trackEvent")

        await waitFor(() => {
          expect(trackEventSpy).toHaveBeenCalledWith(
            expectedEvent.category,
            expectedEvent.action,
            expectedEvent.name,
            expectedEvent.value,
          )
        })
      })

      describe("and a screen has been viewed", () => {
        it("tracks the screen view", async () => {
          expect.assertions(1)

          jest
            .spyOn(StorageUtils, "getAnalyticsConsent")
            .mockResolvedValueOnce(true)

          const analyticsClient = testAnalyticsClient()

          render(
            <ProductAnalyticsProvider productAnalyticsClient={analyticsClient}>
              <TrackScreenView />
            </ProductAnalyticsProvider>,
          )

          const trackScreenViewSpy = jest.spyOn(analyticsClient, "trackView")

          await waitFor(() => {
            expect(trackScreenViewSpy).toHaveBeenCalledWith(["Home"])
          })
        })
      })
    })

    describe("and the user has not consented to analytics", () => {
      describe("and trackEvent is called", () => {
        it("does not track the event", () => {
          expect.assertions(1)
          jest
            .spyOn(StorageUtils, "getAnalyticsConsent")
            .mockResolvedValue(false)

          const expectedEvent: Event = {
            category: "product_analytics",
            action: "event_action",
            name: "event_name",
            value: 1,
          }

          const analyticsClient = testAnalyticsClient()

          const trackEventSpy = jest.spyOn(analyticsClient, "trackEvent")

          render(
            <ProductAnalyticsProvider productAnalyticsClient={analyticsClient}>
              <TrackEvent event={expectedEvent} />
            </ProductAnalyticsProvider>,
          )
          expect(trackEventSpy).not.toHaveBeenCalled()
        })
      })
    })

    describe("and a screen has been viewed", () => {
      it("does not track the screen view", async () => {
        expect.assertions(1)

        jest
          .spyOn(StorageUtils, "getAnalyticsConsent")
          .mockResolvedValueOnce(false)

        const analyticsClient = testAnalyticsClient()

        render(
          <ProductAnalyticsProvider productAnalyticsClient={analyticsClient}>
            <TrackScreenView />
          </ProductAnalyticsProvider>,
        )

        const trackEventSpy = jest.spyOn(analyticsClient, "trackEvent")

        await waitFor(() => {
          expect(trackEventSpy).not.toHaveBeenCalled()
        })
      })
    })
  })
})

const testAnalyticsClient = (
  trackView = () => Promise.resolve(),
  trackEvent = () => Promise.resolve(),
): ProductAnalyticsClient => {
  return {
    trackView,
    trackEvent,
  }
}

type Event = {
  category: EventCategory
  action: string
  name?: string
  value?: number
}

const TrackEvent: FunctionComponent<{
  event: Event
}> = ({ event: { category, action, name, value } }) => {
  const context = useContext(ProductAnalyticsContext)

  useEffect(() => {
    context.trackEvent(category, action, name, value)
  }, [context, category, action, name, value])

  return <Text> User consent status: {context.userConsentedToAnalytics}</Text>
}

const TrackScreenView: FunctionComponent = () => {
  const context = useContext(ProductAnalyticsContext)

  useEffect(() => {
    context.trackScreenView("Home")
  }, [context])
  return <Text> User consent status: {context.userConsentedToAnalytics}</Text>
}
