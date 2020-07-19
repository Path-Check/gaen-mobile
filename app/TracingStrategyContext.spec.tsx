import React from "react"
import { View, Text, ImageBackground, StyleSheet } from "react-native"
import { render, cleanup } from "@testing-library/react-native"
import "@testing-library/jest-native/extend-expect"

import {
  useTracingStrategyContext,
  TracingStrategyProvider,
  useStrategyContent,
} from "./TracingStrategyContext"
import {
  testStrategyAssets,
  testStrategyCopy,
} from "./factories/tracingStrategy"
import { factories } from "./factories"
import { Images } from "../app/assets/images/"

import { TracingStrategy } from "./tracingStrategy"

afterEach(cleanup)

jest.mock("react-i18next", () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}))

const renderTracingStrategyProvider = (strategy: TracingStrategy) => {
  const TestTracingStrategyConsumer = () => {
    const { name } = useTracingStrategyContext()
    const { StrategyAssets, StrategyCopy } = useStrategyContent()

    return (
      <View>
        <Text testID={"tracing-strategy-name"}>{name}</Text>
        <ImageBackground
          source={StrategyAssets.personalPrivacyBackground}
          testID={"tracing-strategy-assets"}
          style={styles.background}
        />
        <Text testID={"tracing-strategy-copy"}>{StrategyCopy.aboutHeader}</Text>
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

    it("provides the correct strategy content", () => {
      const expectedAsset = Images.BlueGradientBackground
      const expectedCopy = "Test About Header"

      const strategy = factories.tracingStrategy.build({
        assets: {
          ...testStrategyAssets,
          personalPrivacyBackground: expectedAsset,
        },
        useCopy: () => {
          return {
            ...testStrategyCopy,
            aboutHeader: expectedCopy,
          }
        },
      })

      const { getByTestId } = renderTracingStrategyProvider(strategy)

      const assets = getByTestId("tracing-strategy-assets")
      const copy = getByTestId("tracing-strategy-copy")

      expect(assets).toHaveProp("source", {
        testUri: "../../../app/assets/images/blueGradientBackground.png",
      })
      expect(copy).toHaveTextContent(expectedCopy)
    })
  })
})

const styles = StyleSheet.create({
  background: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
    position: "absolute",
  },
})
