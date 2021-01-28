import React from "react"
import { render } from "@testing-library/react-native"

import { factories } from "../../factories"
import { CovidDataRequest } from "../Context"
import * as CovidData from "../covidData"

import CovidDataCard from "./CovidDataCard"

jest.mock("@react-navigation/native")
describe("CovidDataCard", () => {
  describe("when there is info missing to get the data", () => {
    it("shows an error with that info", () => {
      const dataRequest: CovidDataRequest = {
        status: "MISSING_INFO",
        data: CovidData.initial,
      }
      const locationName = "locationName"

      const { getByText } = render(
        <CovidDataCard dataRequest={dataRequest} locationName={locationName} />,
      )

      expect(getByText("Apologies, COVID data is unavailable.")).toBeDefined()
    })
  })

  describe("when the data request is loading", () => {
    it("displays a loading spinner", () => {
      const dataRequest: CovidDataRequest = {
        status: "LOADING",
        data: CovidData.initial,
      }
      const locationName = "locationName"

      const { getByTestId } = render(
        <CovidDataCard dataRequest={dataRequest} locationName={locationName} />,
      )

      expect(getByTestId("loading-indicator")).toBeDefined()
    })
  })

  describe("when the data request failed", () => {
    it("displays an error message", () => {
      const dataRequest: CovidDataRequest = {
        status: "ERROR",
        data: CovidData.initial,
      }
      const locationName = "locationName"

      const { getByText } = render(
        <CovidDataCard dataRequest={dataRequest} locationName={locationName} />,
      )

      expect(
        getByText(
          `Sorry, we could not fetch the latest COVID cases data for ${locationName}.`,
        ),
      ).toBeDefined()
    })
  })

  describe("when the request has completed successfuly", () => {
    it("displays the data", () => {
      const dataRequest: CovidDataRequest = {
        status: "SUCCESS",
        data: factories.covidData.build(),
      }
      const locationName = "locationName"

      const { getByTestId } = render(
        <CovidDataCard dataRequest={dataRequest} locationName={locationName} />,
      )

      expect(getByTestId("covid-data")).toBeDefined()
    })
  })
})
