import React from "react"
import { View, Text } from "react-native"
import { render, cleanup } from "@testing-library/react-native"
import "@testing-library/jest-native/extend-expect"

import {
  useTracingStrategyContext,
  TracingStrategyProvider,
} from "./TracingStrategyContext"
import { factories } from "./factories"

import { TracingStrategy } from "./tracingStrategy"

afterEach(cleanup)

jest.mock("react-i18next", () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}))

const renderTracingStrategyProvider = (strategy: TracingStrategy) => {
  const TestTracingStrategyConsumer = () => {
    const { name } = useTracingStrategyContext()

    return (
      <View>
        <Text testID={"tracing-strategy-name"}>{name}</Text>
      </View>
    )
  }

  return render(
    <TracingStrategyProvider strategy={strategy}>
      <TestTracingStrategyConsumer />
    </TracingStrategyProvider>,
  )
}

describe("TracingStrategyProvider", () => {
  describe("when given a tracing strategy ", () => {
    it("subscribes to exposure info events", async () => {
      const removeSubscriptionMock = jest.fn()
      const strategy = factories.tracingStrategy.build({
        exposureEventsStrategy: {
          exposureInfoSubscription: () => {
            return { remove: removeSubscriptionMock }
          },
        },
      })

      const { unmount } = renderTracingStrategyProvider(strategy)

      unmount()
      expect(removeSubscriptionMock).toHaveBeenCalled()
    })
  })
})
