import React from "react"
import { render } from "@testing-library/react-native"
import "@testing-library/jest-native/extend-expect"
import ExposureListDebugScreen from "./ExposureListDebugScreen"
import { ExposureContext } from "../ExposureContext"
import { factories } from "../factories"

describe("ExposureListDebugScreen", () => {
  describe("when there are no exposures", () => {
    it("Displays a helpful message", () => {
      const exposureProviderValue = factories.exposureContext.build()
      const { getByText } = render(
        <ExposureContext.Provider value={exposureProviderValue}>
          <ExposureListDebugScreen />
        </ExposureContext.Provider>,
      )

      expect(getByText("No exposure data to display")).toBeDefined()
    })
  })

  describe("when there is one or more exposure", () => {
    it("displays a list of exposures", () => {
      const exposure1 = factories.exposureDatum.build({
        id: "123",
      })
      const exposure2 = factories.exposureDatum.build({
        id: "456",
      })
      const exposureProviderValue = factories.exposureContext.build({
        exposureInfo: [exposure1, exposure2],
      })

      const { getAllByTestId } = render(
        <ExposureContext.Provider value={exposureProviderValue}>
          <ExposureListDebugScreen />
        </ExposureContext.Provider>,
      )

      expect(getAllByTestId("exposure-list-debug-item")).toHaveLength(2)
    })
  })
})
